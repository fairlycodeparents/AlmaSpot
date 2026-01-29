import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { Request, Response, NextFunction } from "express";
import { SearchController } from "./SearchController";
import { SearchUseCase } from "../../application/ports/InboundPorts";
import { SearchRequestDTO, SuggestionDTO } from "../../application/DTOs";

describe("SearchController", () => {
  const RESPONSE_TEXT = "Plan found";
  const TRIGGER_ERROR = "Trigger error";
  const FAILED_RESPONSE = "Service failed";

  let controller: SearchController;
  let useCaseCalls: SearchRequestDTO[] = [];
  let responseJsonCalls: any[] = [];
  let responseStatusCalls: number[] = [];

  const fakeNext: NextFunction = (err?: any) => {
    if (err) {
      responseStatusCalls.push(500);
      responseJsonCalls.push({ error: err.message });
    }
  };

  const fakeUseCase: SearchUseCase = {
    search: async (request: SearchRequestDTO): Promise<SuggestionDTO> => {
      useCaseCalls.push(request);

      const lastMessage = request.history[request.history.length - 1];
      if (lastMessage && lastMessage.content === TRIGGER_ERROR) {
        throw new Error(FAILED_RESPONSE);
      }

      return {
        plan: [],
        response: RESPONSE_TEXT,
      };
    },
  };

  interface FakeResponse {
    statusCode: number;
    status(code: number): FakeResponse;
    json(body: any): FakeResponse;
  }

  const fakeRes: FakeResponse = {
    statusCode: 200,
    status: function (code: number) {
      responseStatusCalls.push(code);
      this.statusCode = code;
      return this;
    },
    json: function (body: any) {
      responseJsonCalls.push(body);
      return this;
    },
  };

  beforeEach(() => {
    controller = new SearchController(fakeUseCase);
    useCaseCalls = [];
    responseJsonCalls = [];
    responseStatusCalls = [];
  });

  it("should return 200 and suggestion when request is valid", async () => {
    const req = {
      body: {
        history: [
          { role: "user", content: "Ciao" },
          { role: "model", content: "Ciao! Come stai?" },
          { role: "user", content: "Cerco un'aula" },
        ],
      },
    } as Request;

    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls.length, 1);
    assert.strictEqual(responseStatusCalls[0], 200);
    assert.strictEqual(responseJsonCalls[0].response, RESPONSE_TEXT);
    assert.ok(useCaseCalls[0]);
    assert.strictEqual(useCaseCalls[0].history.length, 3);
    assert.ok(useCaseCalls[0].history[2]);
    assert.strictEqual(useCaseCalls[0].history[2].content, "Cerco un'aula");
  });

  it("should return 400 if body is invalid (missing history)", async () => {
    const req = { body: {} } as Request;

    await controller.search(req, fakeRes as Response, fakeNext);

    assert.strictEqual(responseStatusCalls[0], 400);
    assert.match(responseJsonCalls[0].error, /Invalid body request format/);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should return 400 if history is not an array", async () => {
    const req = { body: { history: "Just a string" } } as Request;

    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls[0], 400);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should return 400 if history is an empty array", async () => {
    const req = { body: { history: [] } } as Request;
    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls[0], 400);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should return 400 if a message in history has invalid structure", async () => {
    const req = {
      body: {
        history: [
          { role: "user", content: "Valid" },
          { role: "moderator", content: "Invalid role" },
        ],
      },
    } as Request;

    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls[0], 400);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should call next(error) if the use case throws an error", async () => {
    const req = {
      body: {
        history: [{ role: "user", content: TRIGGER_ERROR }],
      },
    } as Request;

    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(useCaseCalls.length, 1);
    assert.strictEqual(responseStatusCalls[0], 500);
    assert.strictEqual(responseJsonCalls[0].error, FAILED_RESPONSE);
  });
});

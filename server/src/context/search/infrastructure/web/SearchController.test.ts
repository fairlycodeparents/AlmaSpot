import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { Request, Response, NextFunction } from "express";
import { SearchController } from "./SearchController";
import { SearchUseCase } from "../../application/ports/InboundPorts";
import { SearchRequestDTO, SuggestionDTO } from "../../application/DTOs";

describe("SearchController", () => {
  const RESPONSE = "Plan found";
  const TRIGGER_ERROR = "Trigger error";
  const FAILED_RESPONSE = "Service failed";

  let controller: SearchController;
  let useCaseCalls: SearchRequestDTO[] = [];
  let responseJsonCalls: any[] = [];
  let responseStatusCalls: number[] = [];
  let nextCalls: any[] = [];

  const fakeUseCase: SearchUseCase = {
    search: async (request: SearchRequestDTO): Promise<SuggestionDTO> => {
      useCaseCalls.push(request);

      if (request.userMessages.includes(TRIGGER_ERROR)) {
        throw new Error(FAILED_RESPONSE);
      }

      return {
        plan: { slots: [] } as any,
        response: RESPONSE,
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

  const fakeNext: NextFunction = (err?: any) => {
    nextCalls.push(err);
  };

  beforeEach(() => {
    useCaseCalls = [];
    responseJsonCalls = [];
    responseStatusCalls = [];
    nextCalls = [];
    fakeRes.statusCode = 200;
    controller = new SearchController(fakeUseCase);
  });

  it("should return 200 and a suggestion when input is valid", async () => {
    const req = { body: { userMessages: ["Find me a room"] } } as Request;
    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(useCaseCalls.length, 1);
    assert.deepStrictEqual(useCaseCalls[0], {
      userMessages: ["Find me a room"],
    });
    assert.strictEqual(responseJsonCalls.length, 1);
    const responseBody = responseJsonCalls[0] as SuggestionDTO;
    assert.strictEqual(responseBody.response, RESPONSE);
  });

  it("should return 400 if userMessages is missing", async () => {
    const req = { body: {} } as Request;
    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls.length, 1);
    assert.strictEqual(responseStatusCalls[0], 400);
    assert.match(responseJsonCalls[0].error, /Invalid request body/);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should return 400 if userMessages is not an array", async () => {
    const req = { body: { userMessages: "Just a string" } } as Request;
    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls[0], 400);
    assert.match(responseJsonCalls[0].error, /Invalid request body/);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should return 400 if userMessages is an empty array", async () => {
    const req = { body: { userMessages: [] } } as Request;
    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(responseStatusCalls[0], 400);
    assert.match(responseJsonCalls[0].error, /non-empty array/);
    assert.strictEqual(useCaseCalls.length, 0);
  });

  it("should call next(error) if the use case throws an error", async () => {
    const req = { body: { userMessages: [TRIGGER_ERROR] } } as Request;
    await controller.search(req, fakeRes as Response, fakeNext);
    assert.strictEqual(nextCalls.length, 1);
    assert.strictEqual(nextCalls[0].message, FAILED_RESPONSE);
    assert.strictEqual(responseJsonCalls.length, 0);
  });
});

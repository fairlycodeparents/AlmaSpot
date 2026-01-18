import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { Request, Response } from "express";
import { SearchController } from "./SearchController";
import { SearchPlanService } from "../../application/SearchPlanService";
import { SuggestionDTO } from "../../application/DTOs";

describe("SearchController", () => {
  let mockSearch: any;
  let serviceMock: SearchPlanService;
  let controller: SearchController;
  let req: Partial<Request>;
  let res: any;
  let next: any;

  beforeEach(() => {
    mockSearch = mock.fn(async () => ({
      plan: { slots: [] },
      response: "Plan found",
    }));

    serviceMock = {
      search: mockSearch,
    } as SearchPlanService;

    controller = new SearchController(serviceMock);

    req = { body: {} };

    res = {
      status: mock.fn(function (this: any, code: number) {
        this.statusCode = code;
        return this;
      }),
      json: mock.fn(),
      statusCode: 200,
    };

    next = mock.fn();
  });

  it("should return 200 and a suggestion when input is valid", async () => {
    req.body = { userMessages: ["Find me a room"] };

    await controller.search(req as Request, res as Response, next);
    assert.strictEqual(mockSearch.mock.callCount(), 1);
    assert.deepStrictEqual(mockSearch.mock.calls[0].arguments[0], {
      userMessages: ["Find me a room"],
    });
    assert.strictEqual(res.json.mock.callCount(), 1);

    const responseBody = res.json.mock.calls[0].arguments[0] as SuggestionDTO;
    assert.strictEqual(responseBody.response, "Plan found");
  });

  it("should return 400 if userMessages is missing", async () => {
    req.body = {};

    await controller.search(req as Request, res as Response, next);
    assert.strictEqual(res.status.mock.callCount(), 1);
    assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
    assert.strictEqual(res.json.mock.callCount(), 1);

    const errorBody = res.json.mock.calls[0].arguments[0];
    assert.match(errorBody.error, /Invalid request body/);
    assert.strictEqual(mockSearch.mock.callCount(), 0);
  });

  it("should return 400 if userMessages is not an array", async () => {
    req.body = { userMessages: "just a string" };

    await controller.search(req as Request, res as Response, next);
    assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
    assert.match(
      res.json.mock.calls[0].arguments[0].error,
      /Invalid request body/,
    );
    assert.strictEqual(mockSearch.mock.callCount(), 0);
  });

  it("should return 400 if userMessages is an empty array", async () => {
    req.body = { userMessages: [] };

    await controller.search(req as Request, res as Response, next);
    assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
    assert.match(res.json.mock.calls[0].arguments[0].error, /non-empty array/);
    assert.strictEqual(mockSearch.mock.callCount(), 0);
  });

  it("should call next(error) if the service throws an error", async () => {
    req.body = { userMessages: ["Valid request"] };
    const simulatedError = new Error("Service failed");

    serviceMock.search = mock.fn(async () => {
      throw simulatedError;
    });

    await controller.search(req as Request, res as Response, next);
    assert.strictEqual(next.mock.callCount(), 1);
    assert.strictEqual(next.mock.calls[0].arguments[0], simulatedError);
  });
});

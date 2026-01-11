import { describe, it, mock } from "node:test";
import assert from "node:assert";

import { InMemoryEventBus } from "../../../shared/infrastructure/bus/InMemoryEventBus";
import { ActivityAddedListener } from "../application/subscribers/ActivityAddedListener";
import { ActivityAddedEvent } from "../../core";

describe("EventBus and ActivityAddedListener integration", () => {
  it("Should activate the service when an event is published on the bus", async () => {
    const mockService = {
      handleActivityAdded: mock.fn(async () => {
        console.log("Command received!");
      }),
    } as any;

    const listener = new ActivityAddedListener(mockService);
    const eventBus = new InMemoryEventBus();
    eventBus.subscribe(
      ActivityAddedEvent.EVENT_NAME,
      listener.on.bind(listener),
    );
    console.log("Event publication...");
    const testEvent = new ActivityAddedEvent({
      activityId: "123",
      title: "Test Integration",
      roomId: "Aula1",
      campus: "Cesena",
      startTime: new Date("2026-01-11T10:00:00Z"),
      endTime: new Date("2026-01-11T13:00:00Z"),
    });

    await eventBus.publish(testEvent);
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.strictEqual(
      mockService.handleActivityAdded.mock.callCount(),
      1,
      "Service should have been called one time",
    );

    const callArgs = mockService.handleActivityAdded.mock.calls[0].arguments;
    assert.strictEqual(callArgs[0].payload.roomId, "Aula1");
    console.log("Message sent to listener!");
  });
});

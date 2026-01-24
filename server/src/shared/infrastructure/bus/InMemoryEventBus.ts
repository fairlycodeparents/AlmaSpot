import { EventEmitter } from "events";
import { EventBus, DomainEvent } from "../../domain/EventBus";

export class InMemoryEventBus implements EventBus {
  private bus: EventEmitter;

  constructor() {
    this.bus = new EventEmitter();
  }

  async publish(event: DomainEvent): Promise<void> {
    this.bus.emit(event.eventName, event);
  }

  subscribe(eventName: string, callback: (event: any) => Promise<void>): void {
    this.bus.on(eventName, callback);
  }
}

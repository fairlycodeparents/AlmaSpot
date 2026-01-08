import { DomainEvent } from "../../../../shared/domain/EventBus";

export class ActivityAddedEvent implements DomainEvent {
  static readonly EVENT_NAME: string = "core.activity_added";

  readonly eventName = ActivityAddedEvent.EVENT_NAME;
  readonly ocurredOn: Date;
  readonly payload: {
    activityId: string;
    roomId: string;
    campus: string;
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
  };

  constructor(data: {
    activityId: string;
    roomId: string;
    campus: string;
    title: string;
    startTime: Date;
    endTime: Date;
    description?: string;
  }) {
    this.ocurredOn = new Date();
    this.payload = data;
  }
}

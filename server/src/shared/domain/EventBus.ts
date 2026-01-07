export interface DomainEvent {
  eventName: string;
  ocurredOn: Date;
}

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;

  subscribe(eventName: string, callback: (event: any) => Promise<void>): void;
}

export default interface DomainEventHandler<Event extends object> {
  handle(event: Event): void;
}

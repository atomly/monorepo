import DomainEvent from 'collection-service/src/framework/DomainEvent';

export interface DomainEventHandler<Event extends DomainEvent> {
  handle(anEvent: Event): void;
}

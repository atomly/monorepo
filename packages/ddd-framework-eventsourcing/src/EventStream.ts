import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import StoreEvent from 'ddd-framework-core/src/StoreEvent';

/**
 * Event stream of stored Domain Events.
 */
export interface EventStream<Event extends DomainEvent> {
  /**
   * Version of the event stream returned.
   */
  version: number;

  /**
   * All events in the stream fetched from the EventStore.
   */
  events: StoreEvent<Event>[];
}

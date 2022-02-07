import { EventStream } from 'ddd-framework-eventsourcing/src/EventStream';
import { EventStore } from 'ddd-framework-eventsourcing/src/EventStore';
import Identity from 'ddd-framework-core/src/Identity';
import DomainEvent from 'ddd-framework-core/src/DomainEvent';

export default class EsEventStore implements EventStore {
  /**
   * Loads all events of a stream.
   */
  public loadEventStream<Event extends DomainEvent>(
    anId: Identity
  ): Promise<EventStream<Event>>;

  /**
   * Loads subset of events of a stream.
   */
  public loadEventStream<Event extends DomainEvent>(
    anId: Identity,
    skipEvents: number,
    maxCount: number
  ): EventStream<Event>;

  public loadEventStream<Event extends DomainEvent>(
    anId: Identity,
    skipEvents?: number,
    maxCount?: number
  ): EventStream<Event> {}

  /**
   * Appends new events to the stream. Should throw a concurrency
   * exception if the stream version is not the expected version in
   * the store.
   */
  public appendToEventStream<Stream extends EventStream<DomainEvent>>(
    anId: Identity,
    version: Stream['version'],
    events: Stream['events']
  ): Promise<void> {}
}

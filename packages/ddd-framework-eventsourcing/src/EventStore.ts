import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import { EventStore as CoreEventStore } from 'ddd-framework-core/src/EventStore';
import Identity from 'ddd-framework-core/src/Identity';
import { EventStream } from './EventStream';

/**
 * We load Events from the Event Store using the unique identity of the
 * Aggregate instance to be reconstituted.
 *
 * @extends Foo
 */
export interface EventStore extends Omit<CoreEventStore, 'append'> {
  /**
   * Loads all events of a stream.
   */
  loadEventStream<Event extends DomainEvent>(
    anId: Identity
  ): PromiseLike<EventStream<Event>>;

  /**
   * Loads subset of events of a stream.
   */
  loadEventStream<Event extends DomainEvent>(
    anId: Identity,
    skipEvents: number,
    maxCount: number
  ): PromiseLike<EventStream<Event>>;

  /**
   * Appends new events to the stream. Should throw a concurrency
   * exception if the stream version is not the expected version in
   * the store.
   */
  appendToEventStream<Stream extends EventStream<DomainEvent>>(
    anId: Identity,
    version: Stream['version'],
    events: Stream['events']
  ): Promise<void>;
}

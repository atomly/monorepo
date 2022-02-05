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
  ): EventStream<Event>;

  /**
   * Loads subset of events of a stream.
   */
  loadEventStream<Event extends DomainEvent>(
    anId: Identity,
    skipEvents: number,
    maxCount: number
  ): EventStream<Event>;

  // appends events to a stream, throwing
  // OptimisticConcurrencyException another appended
  // new events since expectedversion
  appendToEventStream<Stream extends EventStream<DomainEvent>>(
    anId: Identity,
    version: Stream['version'],
    events: Stream['events']
  ): Promise<void>;
}

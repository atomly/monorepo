import DomainEvent from './DomainEvent';
import StoreEvent from './StoreEvent';

/**
 * Use the Event Store as a queue for publishing all Domain Events through
 * a messaging infrastructure. This is one of its the primary uses. It
 * allows integrations between Bounded Contexts, where remote subscribers
 * react to the Events in terms of their own contextual needs.
 *
 * You might use for other cases, such as but not limited to:
 * - Feed REST-based Event notifications to polling clients.
 * - Examine a historical record of the result of every command that has ever
 * been executed on the model.
 * - Use the data in trending, forecasting, and for other business analytics.
 * - Use the Events to reconstitute each Aggregate instance (Event Sourcing).
 * - Given an application of the preceding point, undo blocks of changes to an
 * Aggregate.
 */
export interface EventStore {
  /**
   * Append the DomainEvent to the end of the actual Event Store by
   * serializing it first to a StoreEvent.
   * @param aDomainEvent - Aggregate or Entity DomainEvent.
   */
  append(aDomainEvent: DomainEvent): Promise<void>;

  /**
   * Serializes the DomainEvent instance into a new StoredEvent
   * instance to be written to the Event Store.
   * @param aDomainEvent - Aggregate or Entity DomainEvent.
   */
  serialize(aDomainEvent: DomainEvent): StoreEvent;
}

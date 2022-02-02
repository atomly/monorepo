import DomainEvent from './DomainEvent';

/**
 * The subscriber may be any component that is running on the same thread as the
 * Aggregate that publishes the Event, and that can subscribe prior to the Event
 * being published.
 *
 * One thing the subscriber should not do is get another Aggregate instance
 * and execute modifying command behavior on it. This would violate the
 * "modify-single-aggregate-instance-in-single-transaction" rule of thumb.
 */
export interface DomainEventSubscriber {
  /**
   * Subscriber event handlers should implement single-responsibility components such
   * as sending notifications after an event happened, storing the Event in an Event
   * Store, forwarding the Event via a messaging infrastructure, etc.
   *
   * Don’t use the Event notification to modify a second Aggregate instance.
   * That breaks a rule of thumb to modify one Aggregate instance per transaction.
   *
   * Idempotency is recommended to handle event duplication, but to be
   * idempotent can be difficult, impractical, or even impossible.
   */
  handleEvent(event: DomainEvent): Promise<void>;

  subscribedToEventType(): Promise<typeof DomainEvent['EventType'][]>;
}

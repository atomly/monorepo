/**
 * Consider including whatever would be necessary to trigger the Event again.
 * This normally includes the identity of the Aggregate instance on which it took
 * place, or any Aggregate instances involved.
 * Using this guidance, we might create properties of any parameters that caused the
 * Event, if discussion proves they are useful. It’s also possible that some resulting
 * Aggregate state transition values could be helpful to subscribers.
 */
export default abstract class DomainEvent {
  public readonly aggregateId: string;

  public readonly occurredOn: Date;

  constructor(
    aggregateId: string,
    occurredOn: DomainEvent['occurredOn'] = new Date()
  ) {
    this.aggregateId = aggregateId;
    this.occurredOn = occurredOn;
  }

  public static readonly EventType: string;

  public static readonly EventVersion: number;
}

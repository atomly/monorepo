import assert from 'assert';
import _ from 'lodash';
import Identity from './Identity';

export type DomainEventMetadata = {
  readonly eventType: string | number;
  readonly eventVersion: string | number;
  readonly occurredOn: Date;
};

/**
 * Consider including whatever would be necessary to trigger the Event again.
 * This normally includes the identity of the Aggregate instance on which it took
 * place, or any Aggregate instances involved.
 * Using this guidance, we might create properties of any parameters that caused the
 * Event, if discussion proves they are useful. It’s also possible that some resulting
 * Aggregate state transition values could be helpful to subscribers.
 */
export default abstract class DomainEvent<
  AggregateIdentity extends Identity = Identity
> {
  public readonly metadata: DomainEventMetadata;

  public readonly aggregateId: AggregateIdentity;

  constructor(aggregateId: AggregateIdentity, occurredOn: Date = new Date()) {
    this.aggregateId = aggregateId;

    const Constructor = this.constructor as typeof DomainEvent;

    assert(
      !DomainEvent.isBlank(Constructor.eventType),
      `[${this.constructor.name}] Static property "eventType" needs to be defined to initiate the event metadata.`
    );

    assert(
      !DomainEvent.isBlank(Constructor.eventVersion),
      `[${this.constructor.name}] Static property "eventVersion" needs to be defined to initiate the event metadata.`
    );

    this.metadata = {
      eventType: Constructor.eventType,
      eventVersion: Constructor.eventVersion,
      occurredOn
    };
  }

  public static readonly eventType: DomainEventMetadata['eventType'];

  public static readonly eventVersion: DomainEventMetadata['eventVersion'];

  /**
   * Checks if `value` is `null`, `undefined`, `NaN`, or an empty string.
   * @param value The value to check.
   * @returns Returns `true` if `value` is nullish, else `false`.
   */
  private static isBlank(value: unknown): boolean {
    return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
  }
}

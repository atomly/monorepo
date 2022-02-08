import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import Identity from 'ddd-framework-core/src/Identity';
import AggregateRoot from './AggregateRoot';

/**
 * Event stream of stored Domain Events.
 */
export class EventStream<Event extends DomainEvent> {
  /**
   * Version of the event stream returned.
   */
  public version: number;

  /**
   * All events in the stream fetched from the EventStore.
   */
  public events: Event[];

  constructor(aggregate: AggregateRoot<Identity, Event>);
  constructor(version: number, events: Event[]);
  constructor(arg1: AggregateRoot | number, events?: Event[]) {
    if (EventStream.isAggregateRoot(arg1)) {
      this.version = arg1.version;
      this.events = arg1.getChanges() as Event[];
    } else {
      this.version = arg1;
      this.events = events!;
    }
  }

  private static isAggregateRoot(arg: unknown): arg is AggregateRoot {
    return arg instanceof AggregateRoot;
  }
}

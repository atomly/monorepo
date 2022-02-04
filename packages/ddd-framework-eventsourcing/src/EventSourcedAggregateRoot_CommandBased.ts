import AggregateRoot from 'collection-service/src/framework/AggregateRoot';
import Command from 'collection-service/src/framework/Command';
import DomainEvent from 'collection-service/src/framework/DomainEvent';
import ValueObject from 'collection-service/src/framework/ValueObject';
import EventSourcedEntity from './EventSourcedEntity';

export default abstract class EventSourcedAggregateRoot<
  Id extends ValueObject,
  AggregateCommand extends Command<Id> = Command<Id>,
  AggregateEvent extends DomainEvent = DomainEvent
> extends AggregateRoot<Id> {
  public version: number = -1;

  private changes: AggregateEvent[] = [];

  constructor(streamEvents?: AggregateEvent[]) {
    super();
    if (streamEvents) this.load(streamEvents);
  }

  public getChanges(): AggregateEvent[] {
    return this.changes;
  }

  public clearChanges(): void {
    this.changes = [];
  }

  public applyChange(aCommand: AggregateCommand) {
    const event = this.handle(aCommand);
    this.ensureValidState();
    this.changes.push(event);
  }

  public handle(aCommand: AggregateCommand): AggregateEvent {
    const event = this.when(aCommand);
    return event;
  }

  public load(eventHistory: AggregateEvent[]): void {
    for (const e of eventHistory) {
      this.when(e);
      this.version += 1;
    }
  }

  protected applyChangeToEntity<
    ChildEntity extends EventSourcedEntity<ValueObject, AggregateEvent>
  >(event: AggregateEvent, entity: ChildEntity) {
    entity?.handle(event);
  }

  protected abstract ensureValidState(): void;

  protected abstract when(aCommand: AggregateCommand): AggregateEvent;

  protected abstract when(anEvent: AggregateEvent): void;
}

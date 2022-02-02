import AggregateRoot from 'collection-service/src/framework/AggregateRoot';
import DomainEvent from 'collection-service/src/framework/DomainEvent';
import ValueObject from 'collection-service/src/framework/ValueObject';
import EventSourcedEntity from './EventSourcedEntity';

export default abstract class EventSourcedAggregateRoot<
  Id extends ValueObject,
  AggregateEvent extends DomainEvent = DomainEvent
> extends AggregateRoot<Id> {
  public version: number = -1;

  private changes: AggregateEvent[] = [];

  public getChanges(): AggregateEvent[] {
    return this.changes;
  }

  public clearChanges(): void {
    this.changes = [];
  }

  public applyChange(event: AggregateEvent) {
    this.handle(event);
    this.ensureValidState && this.ensureValidState();
    this.changes.push(event);
  }

  public handle(event: AggregateEvent): void {
    this.when(event);
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

  protected abstract when(event: AggregateEvent): void;
}

import CoreAggregateRoot from 'collection-service/src/framework/AggregateRoot';
import DomainEvent from 'collection-service/src/framework/DomainEvent';
import Entity from './Entity';
import ValueObject from 'collection-service/src/framework/ValueObject';
import { DomainEventHandler } from './DomainEventHandler';

export default abstract class AggregateRoot<
    Id extends ValueObject = ValueObject,
    AggregateEvent extends DomainEvent = DomainEvent
  >
  extends CoreAggregateRoot<Id>
  implements DomainEventHandler<AggregateEvent>
{
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
    this.ensureValidState();
    this.changes.push(event);
  }

  public handle(event: AggregateEvent): void {
    this.when(event);
    this.version += 1;
  }

  public load(eventHistory: AggregateEvent[]): void {
    for (const e of eventHistory) this.handle(e);
  }

  protected applyChangeOnEntity<
    Event extends DomainEvent,
    ChildEntity extends Entity<ValueObject, Event>
  >(event: Event, entity: ChildEntity): void {
    entity.handle(event);
  }

  protected abstract ensureValidState(): void;

  protected abstract when(event: AggregateEvent): void;
}

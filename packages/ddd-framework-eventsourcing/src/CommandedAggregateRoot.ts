import CoreAggregateRoot from 'collection-service/src/framework/AggregateRoot';
import Command from 'collection-service/src/framework/Command';
import DomainEvent from 'collection-service/src/framework/DomainEvent';
import ValueObject from 'collection-service/src/framework/ValueObject';
import { DomainEventHandler } from './DomainEventHandler';
import Entity from './Entity';

export default abstract class CommandedAggregateRoot<
    Id extends ValueObject,
    AggregateCommand extends Command<Id> = Command<Id>,
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

  public handle(aCommand: AggregateCommand): AggregateEvent;
  public handle(anEvent: AggregateEvent): void;
  public handle(_: AggregateCommand | AggregateEvent): AggregateEvent | void {
    let anEvent: AggregateEvent | void;

    if (_ instanceof Command) {
      const aCommand = _;
      anEvent = this.when(aCommand);
      this.ensureValidState();
      this.changes.push(anEvent);
      this.version += 1;
    } else if (_ instanceof DomainEvent) {
      const anEvent = _;
      this.when(anEvent);
      this.version += 1;
    }

    return anEvent;
  }

  public load(eventHistory: AggregateEvent[]): void {
    for (const e of eventHistory) {
      this.when(e);
      this.version += 1;
    }
  }

  protected applyChangeOnEntity<
    ChildEntity extends Entity<ValueObject, AggregateEvent>
  >(event: AggregateEvent, entity: ChildEntity) {
    entity?.handle(event);
  }

  protected abstract ensureValidState(): void;

  protected abstract when(aCommand: AggregateCommand): AggregateEvent;

  protected abstract when(anEvent: AggregateEvent): void;
}

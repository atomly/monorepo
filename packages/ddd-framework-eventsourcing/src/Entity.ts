import CoreEntity from 'collection-service/src/framework/Entity';
import DomainEvent from 'collection-service/src/framework/DomainEvent';
import ValueObject from 'collection-service/src/framework/ValueObject';
import { Action } from './Action';
import { DomainEventHandler } from './DomainEventHandler';

export default abstract class Entity<
    Id extends ValueObject = ValueObject,
    EntityEvent extends DomainEvent = DomainEvent
  >
  extends CoreEntity<Id>
  implements DomainEventHandler<EntityEvent>
{
  private readonly applier: Action<EntityEvent>;

  constructor(applier: Action<EntityEvent>) {
    super();
    this.applier = applier;
  }

  public applyChange(anEvent: EntityEvent) {
    this.handle(anEvent);
    this.ensureValidState && this.ensureValidState();
    this.applier(anEvent);
  }

  public handle(anEvent: EntityEvent): void {
    this.when(anEvent);
  }

  protected abstract when(anEvent: EntityEvent): void;
}

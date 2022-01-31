import DomainEventHandler from './DomainEventHandler';
import { Action } from './utils/Action';

export default abstract class Entity<Id, EntityEvent extends object>
  implements DomainEventHandler<EntityEvent>
{
  public id: Id;

  constructor(id: Id) {
    this.id = id;
  }

  public handle(event: EntityEvent): void {
    this.when(event);
  }

  public apply(event: EntityEvent, applier: Action<EntityEvent>) {
    this.handle(event);
    this.ensureValidState();
    applier(event);
  }

  protected abstract ensureValidState(): void;

  protected abstract when(event: EntityEvent): void;
}

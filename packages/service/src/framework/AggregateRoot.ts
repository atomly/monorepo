import DomainEventHandler from './DomainEventHandler';
import Entity from './Entity';

export default abstract class AggregateRoot<Id, AggregateEvent extends object>
  implements DomainEventHandler<AggregateEvent>
{
  public id: Id;

  public version: number;

  private changes: AggregateEvent[];

  constructor(id: Id) {
    this.id = id;
    this.version = 0;
    this.changes = [];
  }

  public getChanges(): AggregateEvent[] {
    return this.changes;
  }

  public clearChanges(): void {
    this.changes = [];
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

  protected apply(event: AggregateEvent) {
    this.handle(event);
    this.ensureValidState();
    this.changes.push(event);
  }

  protected abstract ensureValidState(): void;

  protected abstract when(event: AggregateEvent): void;

  protected applyToEntity<
    AggregateEntity extends Entity<unknown, AggregateEvent>
  >(event: AggregateEvent, entity: AggregateEntity) {
    entity?.apply(event, this.apply);
  }
}

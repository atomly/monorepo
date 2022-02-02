import Entity from './Entity';
import ValueObject from './ValueObject';

export default abstract class AggregateRoot<
  Id extends ValueObject
> extends Entity<Id> {}

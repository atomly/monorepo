import Entity from './Entity';
import ValueObject from './ValueObject';

export default abstract class AggregateRoot<
  Id extends ValueObject = ValueObject
> extends Entity<Id> {}

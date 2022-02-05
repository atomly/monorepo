import Entity from './Entity';
import ValueObject from './ValueObject';

/**
 * Entity serving as an Aggregate Root of an object cluster composed of
 * Entities and Value Objects for transactional boundaries.
 */
export default abstract class AggregateRoot<
  Id extends ValueObject = ValueObject
> extends Entity<Id> {}

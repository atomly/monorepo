import Entity from './Entity';
import Identity from './Identity';

/**
 * Entity serving as an Aggregate Root of an object cluster composed of
 * Entities and Value Objects for transactional boundaries.
 */
export default abstract class AggregateRoot<
  Id extends Identity = Identity
> extends Entity<Id> {}

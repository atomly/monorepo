import IdentifiedDomainObject from './IdentifiedDomainObject';
import Identity from './Identity';

/**
 * Entities are not fundamentally defined by their properties, but rather by a thread
 * of continuity and identity. An object defined primarily by its identity is called
 * an Entity.
 */
export default abstract class Entity<
  Id extends Identity = Identity
> extends IdentifiedDomainObject<Id> {
  // private concurrencyVersion: number = 0;

  // public getConcurrencyVersion(): number {
  //   return this.concurrencyVersion;
  // }

  // public setConcurrencyVersion(aVersion: number): void {
  //   this.failWhenConcurrencyViolation(aVersion);
  //   this.concurrencyVersion = aVersion;
  // }

  // public failWhenConcurrencyViolation(aVersion: number): void {
  //   if (aVersion !== this.concurrencyVersion) {
  //     throw new IllegalStateException(
  //       'Concurrency Violation: Stale data detected. Entity was already modified.'
  //     );
  //   }
  // }

  protected validateInvariants?(): void;
}

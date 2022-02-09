import Identity from './Identity';

/**
 * An Identified Domain Object is any object implementing an `id` property
 * holding a `ValueObject` to enforce unique identities.
 */
export default abstract class IdentifiedDomainObject<Id extends Identity> {
  public abstract id: Id;

  public equals(
    anIdentifiedDomainObject: IdentifiedDomainObject<Identity>
  ): boolean {
    return this.id.equals(anIdentifiedDomainObject.id);
  }

  public static Null: Identity;
}

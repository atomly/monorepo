import ValueObject from './ValueObject';

/**
 * An Identified Domain Object is any object implementing an `id` property
 * holding a `ValueObject` to enforce unique identities.
 */
export default abstract class IdentifiedDomainObject<Id extends ValueObject> {
  public abstract id: Id;

  public equals(
    anIdentifiedDomainObject: IdentifiedDomainObject<ValueObject>
  ): boolean {
    return this.id.equals(anIdentifiedDomainObject.id);
  }

  public static Null: ValueObject;
}

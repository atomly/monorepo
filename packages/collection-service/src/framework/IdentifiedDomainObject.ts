import ValueObject from './ValueObject';

export default abstract class IdentifiedDomainObject<Id extends ValueObject> {
  public abstract id: Id;

  public equals(
    anIdentifiedDomainObject: IdentifiedDomainObject<ValueObject>
  ): boolean {
    return this.id.equals(anIdentifiedDomainObject.id);
  }

  public static Null: ValueObject;
}

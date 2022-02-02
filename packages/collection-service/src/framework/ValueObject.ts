import { isEqual, toString } from 'lodash';

/**
 * When you care only about the attributes of an element of the model, classify it as
 * a ValueObject. Make it express the meaning of the attributes it conveys and
 * give it related functionality. Treat the ValueObject as immutable. Don’t give
 * it any identity and avoid the design complexities necessary to maintain Entities.
 */
export default abstract class ValueObject {
  public equals(object: ValueObject): boolean {
    return isEqual(this, object);
  }

  public notEquals(object: ValueObject): boolean {
    return !this.equals(object);
  }

  public toJSON() {
    const { equals, notEquals, toJSON, toString, ...rest } = this;
    return JSON.stringify(rest, null);
  }

  public toString() {
    return toString(this);
  }

  public static Null: ValueObject;
}

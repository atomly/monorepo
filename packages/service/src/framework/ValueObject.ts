import { isEqual, toString } from 'lodash';

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
}

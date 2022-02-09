import ValueObject from './ValueObject';

/**
 * Identity `ValueObject` containing unique ID values.
 */
export default abstract class Identity extends ValueObject {
  public value: string;

  constructor(id: string) {
    super();
    this.value = id;
  }

  public static Null: Identity;
}

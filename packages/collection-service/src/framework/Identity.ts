import ValueObject from 'collection-service/src/framework/ValueObject';

export default abstract class Identity extends ValueObject {
  public value: string;

  constructor(id: string) {
    super();
    this.value = id;
  }

  public static Null: Identity;
}

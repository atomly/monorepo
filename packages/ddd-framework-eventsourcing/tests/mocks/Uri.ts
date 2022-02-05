import ValueObject from 'ddd-framework-core/src/ValueObject';

export default class Uri extends ValueObject {
  public uri: string;

  constructor(uri: string) {
    super();
    this.uri = uri;
  }

  public static Null = new Uri('');
}

import ValueObject from 'collection-service/src/framework/ValueObject';

export default class PictureId extends ValueObject {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  public static Null = new PictureId('');
}

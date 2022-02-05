import ValueObject from 'ddd-framework-core/src/ValueObject';

export default class Address extends ValueObject {
  public country: string;

  public city: string;

  public street: string;

  public zipCode: string;

  constructor(country: string, city: string, street: string, zipCode: string) {
    super();
    this.country = country;
    this.city = city;
    this.street = street;
    this.zipCode = zipCode;
  }

  static Null: Address = new Address('', '', '', '');
}

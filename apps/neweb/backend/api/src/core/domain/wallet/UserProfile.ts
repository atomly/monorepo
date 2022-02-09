import ValueObject from 'ddd-framework-core/src/ValueObject';
import { Anemic } from 'ddd-framework-core/src/utils/Anemic';

export default class UserProfile extends ValueObject {
  public firstName: string;

  public lastName: string;

  public email: string;

  constructor(data: Anemic<UserProfile>) {
    super();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
  }

  static Null = new UserProfile({ firstName: '', lastName: '', email: '' });
}

import faker from '@faker-js/faker';
import AggregateRoot from '../../src/framework/AggregateRoot';
import ValueObject from '../../src/framework/ValueObject';

class UserId extends ValueObject {
  value: string;

  constructor(id: string) {
    super();
    this.value = id;
  }
}
class User extends AggregateRoot<UserId> {
  public id: UserId;

  constructor(id: UserId) {
    super();
    this.id = id;
  }
}

describe('AggregateRoot', () => {
  test('equals', () => {
    const idOne = faker.datatype.uuid();
    const idTwo = faker.datatype.uuid();

    const userOne = new User(new UserId(idOne));
    const userTwo = new User(new UserId(idOne));
    const userThree = new User(new UserId(idTwo));

    expect(userOne.equals(userTwo)).toBe(true);
    expect(userOne.equals(userThree)).toBe(false);
  });
});

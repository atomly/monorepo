import faker from '@faker-js/faker';
import Entity from '../src/Entity';
import ValueObject from '../src/ValueObject';

class UserId extends ValueObject {
  value: string;

  constructor(id: string) {
    super();
    this.value = id;
  }
}

class User extends Entity<UserId> {
  public id: UserId;

  constructor(id: UserId) {
    super();
    this.id = id;
  }
}

describe('Entity', () => {
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

import faker from '@faker-js/faker';
import DomainEvent from '../src/DomainEvent';
import Identity from '../src/Identity';

class OrderId extends Identity {
  public static Null = new OrderId('');
}

describe('DomainEvent', () => {
  const date = faker.date.recent();

  test('aggregateId and metadata are correctly initialized', () => {
    class OrderCreated extends DomainEvent<OrderId> {
      public static readonly eventType = 'OrderCreated';

      public static readonly eventVersion = 0;
    }

    const event = new OrderCreated(OrderId.Null, date);

    expect(event.aggregateId).toBe(OrderId.Null);

    expect(event.metadata).toMatchObject({
      eventType: OrderCreated.eventType,
      eventVersion: OrderCreated.eventVersion,
      occurredOn: date
    });
  });

  test('throws error if static property eventType is missing from DomainEvent', () => {
    class OrderShipped extends DomainEvent<OrderId> {
      // public static readonly eventType = 'OrderShipped';

      public static readonly eventVersion = faker.system.semver();
    }

    expect(() => new OrderShipped(OrderId.Null, date)).toThrow();
  });

  test('throws error if static property eventVersion is missing from DomainEvent', () => {
    class OrderShipped extends DomainEvent<OrderId> {
      public static readonly eventType = 'OrderShipped';

      // public static readonly eventVersion = faker.system.semver();
    }

    expect(() => new OrderShipped(OrderId.Null, date)).toThrow();
  });

  test('throws error if static property eventType is an empty string', () => {
    class OrderShipped extends DomainEvent<OrderId> {
      public static readonly eventType = '';

      public static readonly eventVersion = faker.system.semver();
    }

    expect(() => new OrderShipped(OrderId.Null, date)).toThrow();
  });

  test('throws error if static property eventVersion is an empty string', () => {
    class OrderShipped extends DomainEvent<OrderId> {
      public static readonly eventType = 'OrderShipped';

      public static readonly eventVersion = '';
    }

    expect(() => new OrderShipped(OrderId.Null, date)).toThrow();
  });
});

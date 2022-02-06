import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import OrderId from './OrderId';

export class OrderCreated extends DomainEvent<OrderId> {
  public static readonly EventType = 'OrderCreated';

  public static readonly EventVersion = 0;
}

export class OrderReset extends DomainEvent<OrderId> {
  public static readonly EventType = 'OrderReset';

  public static readonly EventVersion = 0;
}

export class OrderLineAdded extends DomainEvent<OrderId> {
  public readonly orderLineId: string;

  public readonly orderLineProductId: string;

  constructor(
    anOrderId: OrderId,
    anOrderLineId: string,
    orderLineProductId: string
  ) {
    super(anOrderId);
    this.orderLineId = anOrderLineId;
    this.orderLineProductId = orderLineProductId;
  }

  public static readonly EventType = 'OrderLineAdded';

  public static readonly EventVersion = 0;
}

export class OrderLineRemoved extends DomainEvent<OrderId> {
  public readonly orderLineId: string;

  constructor(anOrderId: OrderId, anOrderLineId: string) {
    super(anOrderId);
    this.orderLineId = anOrderLineId;
  }

  public static readonly EventType = 'OrderLineRemoved';

  public static readonly EventVersion = 0;
}

export class ShippingAddressSet extends DomainEvent<OrderId> {
  public country: string;

  public city: string;

  public street: string;

  public zipCode: string;

  constructor(
    anOrderId: OrderId,
    country: string,
    city: string,
    street: string,
    zipCode: string
  ) {
    super(anOrderId);
    this.country = country;
    this.city = city;
    this.street = street;
    this.zipCode = zipCode;
  }

  public static readonly EventType = 'ShippingAddressSet';

  public static readonly EventVersion = 0;
}

export class BillingAddressSet extends DomainEvent<OrderId> {
  public country: string;

  public city: string;

  public street: string;

  public zipCode: string;

  constructor(
    anOrderId: OrderId,
    country: string,
    city: string,
    street: string,
    zipCode: string
  ) {
    super(anOrderId);
    this.country = country;
    this.city = city;
    this.street = street;
    this.zipCode = zipCode;
  }

  public static readonly EventType = 'BillingAddressSet';

  public static readonly EventVersion = 0;
}

export class OrderPlaced extends DomainEvent<OrderId> {
  public static readonly EventType = 'OrderPlaced';

  public static readonly EventVersion = 0;
}

export class OrderShipped extends DomainEvent<OrderId> {
  public static readonly EventType = 'OrderShipped';

  public static readonly EventVersion = 0;
}

export class OrderSentForDelivery extends DomainEvent<OrderId> {
  public static readonly EventType = 'OrderSentForDelivery';

  public static readonly EventVersion = 0;
}

export class OrderDelivered extends DomainEvent<OrderId> {
  public static readonly EventType = 'OrderDelivered';

  public static readonly EventVersion = 0;
}

export type OrderEvents =
  | OrderCreated
  | OrderReset
  | OrderLineAdded
  | OrderLineRemoved
  | ShippingAddressSet
  | BillingAddressSet
  | OrderPlaced
  | OrderShipped
  | OrderSentForDelivery
  | OrderDelivered;

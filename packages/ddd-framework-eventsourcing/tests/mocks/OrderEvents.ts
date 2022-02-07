import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import OrderId from './OrderId';

export class OrderCreated extends DomainEvent<OrderId> {
  public static readonly eventType = 'OrderCreated';

  public static readonly eventVersion = 0;
}

export class OrderReset extends DomainEvent<OrderId> {
  public static readonly eventType = 'OrderReset';

  public static readonly eventVersion = 0;
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

  public static readonly eventType = 'OrderLineAdded';

  public static readonly eventVersion = 0;
}

export class OrderLineRemoved extends DomainEvent<OrderId> {
  public readonly orderLineId: string;

  constructor(anOrderId: OrderId, anOrderLineId: string) {
    super(anOrderId);
    this.orderLineId = anOrderLineId;
  }

  public static readonly eventType = 'OrderLineRemoved';

  public static readonly eventVersion = 0;
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

  public static readonly eventType = 'ShippingAddressSet';

  public static readonly eventVersion = 0;
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

  public static readonly eventType = 'BillingAddressSet';

  public static readonly eventVersion = 0;
}

export class OrderPlaced extends DomainEvent<OrderId> {
  public static readonly eventType = 'OrderPlaced';

  public static readonly eventVersion = 0;
}

export class OrderShipped extends DomainEvent<OrderId> {
  public static readonly eventType = 'OrderShipped';

  public static readonly eventVersion = 0;
}

export class OrderSentForDelivery extends DomainEvent<OrderId> {
  public static readonly eventType = 'OrderSentForDelivery';

  public static readonly eventVersion = 0;
}

export class OrderDelivered extends DomainEvent<OrderId> {
  public static readonly eventType = 'OrderDelivered';

  public static readonly eventVersion = 0;
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

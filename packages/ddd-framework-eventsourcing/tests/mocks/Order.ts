import assert from 'assert';
import DomainEvent from 'collection-service/src/framework/DomainEvent';
import EventSourcedAggregateRoot from '../../src/EventSourcedAggregateRoot';
import Address from './Address';
import * as Events from './OrderEvents';
import OrderId from './OrderId';
import OrderLine from './OrderLine';
import OrderLineId from './OrderLineId';

enum OrderState {
  Null,
  Shopping,
  Placed,
  Shipped,
  OutForDelivery,
  Delivered
}

export default class Order extends EventSourcedAggregateRoot<
  OrderId,
  Events.OrderEvents
> {
  public id: OrderId = OrderId.Null;

  public state: OrderState = OrderState.Null;

  public orderLines: OrderLine[] = [];

  public billingAddress: Address = Address.Null;

  public shippingAddress: Address = Address.Null;

  // constructor(streamEvents?: Events[]) {
  //   super();
  //   this.id = OrderId.Null;
  //   this.state = OrderState.Null;
  //   this.billingAddress = Address.Null;
  //   this.shippingAddress = Address.Null;
  // }

  public create(anId: OrderId): void {
    this.applyChange(new Events.OrderCreated(anId.value));
  }

  public restart(): void {
    this.applyChange(new Events.OrderReset(this.id.value));
  }

  public addOrderLine(anOrderLine: OrderLine): void {
    this.applyChange(
      new Events.OrderLineAdded(
        this.id.value,
        anOrderLine.id.value,
        anOrderLine.productId.value
      )
    );
  }

  public removeOrderLine(anOrderLine: OrderLine): void {
    this.applyChange(
      new Events.OrderLineRemoved(this.id.value, anOrderLine.id.value)
    );
  }

  public setShippingAddress(anAddress: Address): void {
    this.applyChange(
      new Events.ShippingAddressSet(
        this.id.value,
        anAddress.country,
        anAddress.city,
        anAddress.street,
        anAddress.zipCode
      )
    );
  }

  public setBillingAddress(anAddress: Address): void {
    this.applyChange(
      new Events.BillingAddressSet(
        this.id.value,
        anAddress.country,
        anAddress.city,
        anAddress.street,
        anAddress.zipCode
      )
    );
  }

  public place(): void {
    this.applyChange(new Events.OrderPlaced(this.id.value));
  }

  public shipOrder(): void {
    this.applyChange(new Events.OrderShipped(this.id.value));
  }

  public deliver(): void {
    this.applyChange(new Events.OrderSentForDelivery(this.id.value));
  }

  public markOrderAsDelivered(): void {
    this.applyChange(new Events.OrderDelivered(this.id.value));
  }

  protected ensureValidState(): void {
    switch (this.state) {
      case OrderState.Placed:
      case OrderState.Shipped:
      case OrderState.OutForDelivery:
      case OrderState.Delivered: {
        this.id.notEquals(OrderId.Null);
        this.billingAddress.notEquals(Address.Null);
        this.shippingAddress.notEquals(Address.Null);
      }
    }
  }

  protected when(event: Events.OrderEvents): void {
    if (event instanceof Events.OrderCreated) {
      this.id = new OrderId(event.entityId);
      this.state = OrderState.Shopping;
    } else if (event instanceof Events.OrderReset) {
      this.orderLines = [];
      this.state = OrderState.Shopping;
    } else if (event instanceof Events.OrderLineAdded) {
      const orderLine = this.applyChangeToEntity(
        event,
        new OrderLine(this.applyChange)
      );
      this.orderLines.push(orderLine);
    } else if (event instanceof Events.OrderLineRemoved) {
      const removedOrderLineId = new OrderLineId(event.orderLineId);
      this.orderLines.filter((orderLine) =>
        orderLine.id.equals(removedOrderLineId)
      );
    } else if (event instanceof Events.ShippingAddressSet) {
      this.shippingAddress = new Address(
        event.country,
        event.city,
        event.street,
        event.zipCode
      );
    } else if (event instanceof Events.BillingAddressSet) {
      this.billingAddress = new Address(
        event.country,
        event.city,
        event.street,
        event.zipCode
      );
    } else if (event instanceof Events.OrderPlaced) {
      this.state = OrderState.Placed;
    } else if (event instanceof Events.OrderShipped) {
      this.state = OrderState.Shipped;
    } else if (event instanceof Events.OrderSentForDelivery) {
      this.state = OrderState.OutForDelivery;
    } else if (event instanceof Events.OrderDelivered) {
      this.state = OrderState.Delivered;
    }
  }

  private static isEventInstanceOf<OrderEvent extends Events.OrderEvents>(
    aDomainEvent: DomainEvent,
    aClass: Function
  ): aDomainEvent is OrderEvent {
    return aDomainEvent instanceof aClass;
  }
}

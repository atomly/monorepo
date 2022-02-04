import assert from 'assert';
import AggregateRoot from '../../src/AggregateRoot';
import Address from './Address';
import * as Events from './OrderEvents';
import OrderId from './OrderId';
import OrderLine from './OrderLine';
import OrderLineId from './OrderLineId';
import { OrderState } from './OrderState';
import ProductId from './ProductId';

export default class Order extends AggregateRoot<OrderId, Events.OrderEvents> {
  public id: OrderId = OrderId.Null;

  public state: OrderState = OrderState.Null;

  public orderLines: OrderLine[] = [];

  public billingAddress: Address = Address.Null;

  public shippingAddress: Address = Address.Null;

  public create(anId: OrderId): void {
    this.applyChange(new Events.OrderCreated(anId.value));
  }

  public restart(): void {
    this.applyChange(new Events.OrderReset(this.id.value));
  }

  public addOrderLine(anOrderLineId: OrderLineId, aProductId: ProductId): void {
    this.applyChange(
      new Events.OrderLineAdded(
        this.id.value,
        anOrderLineId.value,
        aProductId.value
      )
    );
  }

  public removeOrderLine(anOrderLineId: OrderLineId): void {
    this.applyChange(
      new Events.OrderLineRemoved(this.id.value, anOrderLineId.value)
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

  public ship(): void {
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
      case OrderState.Null: {
        this.id.equals(OrderId.Null);
        assert(this.orderLines.length === 0);
        break;
      }
      case OrderState.Shopping: {
        assert(this.id.notEquals(OrderId.Null));
        break;
      }
      case OrderState.Placed:
      case OrderState.Shipped:
      case OrderState.OutForDelivery:
      case OrderState.Delivered: {
        assert(this.id.notEquals(OrderId.Null));
        assert(this.billingAddress.notEquals(Address.Null));
        assert(this.shippingAddress.notEquals(Address.Null));
        assert(this.orderLines.length > 0);
        break;
      }
    }
  }

  protected when(event: Events.OrderEvents): void {
    if (event instanceof Events.OrderCreated) {
      this.id = new OrderId(event.aggregateId);
      this.state = OrderState.Shopping;
    } else if (event instanceof Events.OrderReset) {
      this.orderLines = [];
      this.state = OrderState.Shopping;
    } else if (event instanceof Events.OrderLineAdded) {
      const orderLine = new OrderLine(this.applyChange);
      this.applyChangeOnEntity(event, orderLine);
      this.orderLines.push(orderLine);
    } else if (event instanceof Events.OrderLineRemoved) {
      const removedOrderLineId = new OrderLineId(event.orderLineId);
      this.orderLines = this.orderLines.filter((orderLine) =>
        orderLine.id.notEquals(removedOrderLineId)
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
}

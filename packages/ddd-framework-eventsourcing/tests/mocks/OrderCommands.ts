import Command from 'ddd-framework-core/src/Command';
import Address from './Address';
import OrderId from './OrderId';
import OrderLine from './OrderLine';
import OrderLineId from './OrderLineId';

export class CreateOrder extends Command<OrderId> {}

export class RestartOrder extends Command<OrderId> {}

export class AddOrderLine extends Command<OrderId> {
  public orderLine: OrderLine;

  constructor(anId: OrderId, anOrderLine: OrderLine) {
    super(anId);
    this.orderLine = anOrderLine;
  }
}

export class RemoveOrderLine extends Command<OrderId> {
  public orderLineId: OrderLineId;

  constructor(anId: OrderId, anOrderLineId: OrderLineId) {
    super(anId);
    this.orderLineId = anOrderLineId;
  }
}

export class SetShippingAddress extends Command<OrderId> {
  public address: Address;

  constructor(anId: OrderId, anAddress: Address) {
    super(anId);
    this.address = anAddress;
  }
}

export class SetBillingAddress extends Command<OrderId> {
  public address: Address;

  constructor(anId: OrderId, anAddress: Address) {
    super(anId);
    this.address = anAddress;
  }
}

export class PlaceOrder extends Command<OrderId> {}

export class ShipOrder extends Command<OrderId> {}

export class DeliverOrder extends Command<OrderId> {}

export class MarkOrderAsDelivered extends Command<OrderId> {}

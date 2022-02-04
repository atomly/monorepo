import EventSourcedEntity from '../../src/EventSourcedEntity';
import OrderLineId from './OrderLineId';
import ProductId from './ProductId';

export default class OrderLine extends EventSourcedEntity<OrderLineId> {
  public readonly productId: ProductId;
}

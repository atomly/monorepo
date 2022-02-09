import Identity from '@ddd-framework/core/src/Identity';

export default class OrderLineId extends Identity {
  public static Null = new OrderLineId('');
}

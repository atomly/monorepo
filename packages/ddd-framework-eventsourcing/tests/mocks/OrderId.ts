import Identity from 'ddd-framework-core/src/Identity';

export default class OrderId extends Identity {
  public static Null = new OrderId('');
}

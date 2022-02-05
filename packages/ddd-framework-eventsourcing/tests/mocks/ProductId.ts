import Identity from 'ddd-framework-core/src/Identity';

export default class ProductId extends Identity {
  public static Null = new ProductId('');
}

import Identity from '@ddd-framework/core/src/Identity';

export default class CollectionId extends Identity {
  public static Null = new CollectionId('');
}

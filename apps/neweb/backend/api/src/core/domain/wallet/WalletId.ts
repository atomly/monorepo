import Identity from '@ddd-framework/core/src/Identity';

export default class WalletId extends Identity {
  public static Null = new WalletId('');
}

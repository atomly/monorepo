import Identity from 'ddd-framework-core/src/Identity';

const genesisAddress: string = '0x0000000000000000000000000000000000000000';

export default class Address extends Identity {
  public static Null = new Address(genesisAddress);
}

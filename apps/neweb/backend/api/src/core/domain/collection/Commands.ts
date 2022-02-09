import Command from '@ddd-framework/core/src/Command';
import Wallet from '../wallet/Wallet';
import CollectionId from './CollectionId';

export namespace V0 {
  export class CreateCollection extends Command<CollectionId> {
    public owner: Wallet;

    public royalties: number;

    public totalSupply?: number;

    public baseUri?: string;
  }

  export class ApproveWallet extends Command<CollectionId> {}

  export class UpdateTotalSupply extends Command<CollectionId> {}

  export class UpdateCollectionBaseUri extends Command<CollectionId> {}

  export class UpdateRoyalties extends Command<CollectionId> {}

  export class UpdateWhitelist extends Command<CollectionId> {}
}

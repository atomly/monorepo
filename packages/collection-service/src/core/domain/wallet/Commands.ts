import Command from 'ddd-framework-core/src/Command';
import { DataTransferObject } from 'ddd-framework-core/src/utils/DataTransferObject';
import Address from '../common/Address';
import { Network } from '../Network';
import WalletId from './WalletId';

export namespace ConnectWallet {
  export class V0 extends Command<WalletId> {
    public owner: Address;

    public network: Network;

    constructor(data: DataTransferObject<V0>) {
      super(new WalletId(data.aggregateId.value));
      this.owner = new Address(data.owner.value);
      this.network = data.network;
    }
  }
}

export namespace SignToS {
  export class V0 extends Command<WalletId> {
    constructor(data: DataTransferObject<V0>) {
      super(new WalletId(data.aggregateId.value));
    }
  }
}

export namespace RegisterUser {
  export class V0 extends Command<WalletId> {
    public userFirstName: string;

    public userLastName: string;

    public userEmail: string;

    constructor(data: DataTransferObject<V0>) {
      super(new WalletId(data.aggregateId.value));
      this.userFirstName = data.userFirstName;
      this.userLastName = data.userLastName;
      this.userEmail = data.userEmail;
    }
  }
}

export namespace UpdateUserProfile {
  export class V0 extends Command<WalletId> {
    public userFirstName: string;

    public userLastName: string;

    constructor(data: DataTransferObject<V0>) {
      super(new WalletId(data.aggregateId.value));
      this.userFirstName = data.userFirstName;
      this.userLastName = data.userLastName;
    }
  }
}

export namespace GenerateApiKeys {
  export class V0 extends Command<WalletId> {
    constructor(data: DataTransferObject<V0>) {
      super(new WalletId(data.aggregateId.value));
    }
  }
}

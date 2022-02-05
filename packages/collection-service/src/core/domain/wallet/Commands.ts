import Command from 'ddd-framework-core/src/Command';
import { DataTransferObject } from 'ddd-framework-core/src/utils/DataTransferObject';
import Address from '../Address';
import { Network } from '../Network';
import WalletId from './WalletId';

export namespace V0 {
  export class ConnectWallet extends Command<WalletId> {
    public owner: Address;

    public network: Network;

    constructor(data: DataTransferObject<ConnectWallet>) {
      super(new WalletId(data.aggregateId.value));
      this.owner = new Address(data.owner.value);
      this.network = data.network;
    }
  }

  export class SignTOS extends Command<WalletId> {
    constructor(data: DataTransferObject<SignTOS>) {
      super(new WalletId(data.aggregateId.value));
    }
  }

  export class RegisterUser extends Command<WalletId> {
    public userFirstName: string;

    public userLastName: string;

    public userEmail: string;

    constructor(data: DataTransferObject<RegisterUser>) {
      super(new WalletId(data.aggregateId.value));
      this.userFirstName = data.userFirstName;
      this.userLastName = data.userLastName;
      this.userEmail = data.userEmail;
    }
  }

  export class UpdateUserProfile extends Command<WalletId> {
    public userFirstName: string;

    public userLastName: string;

    constructor(data: DataTransferObject<UpdateUserProfile>) {
      super(new WalletId(data.aggregateId.value));
      this.userFirstName = data.userFirstName;
      this.userLastName = data.userLastName;
    }
  }

  export class GenerateApiKeys extends Command<WalletId> {
    constructor(data: DataTransferObject<GenerateApiKeys>) {
      super(new WalletId(data.aggregateId.value));
    }
  }
}

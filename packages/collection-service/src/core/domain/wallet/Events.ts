import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import { DataTransferObject } from 'ddd-framework-core/src/utils/DataTransferObject';
import Address from '../common/Address';
import EncryptedValue from '../common/EncryptedValue';
import { Network } from '../Network';
import ApiKeys from './ApiKeys';
import WalletId from './WalletId';

export type WalletEvents =
  | WalletConnected.V0
  | TermsOfServiceSigned.V0
  | UserRegistered.V0
  | UserProfileUpdated.V0
  | ApiKeysGenerated.V0;

export namespace WalletConnected {
  export class V0 extends DomainEvent<WalletId> {
    public owner: Address;

    public network: Network;

    constructor(data: DataTransferObject<V0, 'occurredOn'>) {
      super(new WalletId(data.aggregateId.value));
      this.owner = new Address(data.owner.value);
      this.network = data.network;
    }
  }
}

export namespace TermsOfServiceSigned {
  export class V0 extends DomainEvent<WalletId> {
    constructor(data: DataTransferObject<V0, 'occurredOn'>) {
      super(new WalletId(data.aggregateId.value));
    }
  }
}

export namespace UserRegistered {
  export class V0 extends DomainEvent<WalletId> {
    public userFirstName: string;

    public userLastName: string;

    public userEmail: string;

    constructor(data: DataTransferObject<V0, 'occurredOn'>) {
      super(new WalletId(data.aggregateId.value));
      this.userFirstName = data.userFirstName;
      this.userLastName = data.userLastName;
      this.userEmail = data.userEmail;
    }
  }
}

export namespace UserProfileUpdated {
  export class V0 extends DomainEvent<WalletId> {
    public userFirstName: string;

    public userLastName: string;

    constructor(data: DataTransferObject<V0, 'occurredOn'>) {
      super(new WalletId(data.aggregateId.value));
      this.userFirstName = data.userFirstName;
      this.userLastName = data.userLastName;
    }
  }
}

export namespace ApiKeysGenerated {
  export class V0 extends DomainEvent<WalletId> {
    public apiKeys: ApiKeys;

    constructor(data: DataTransferObject<V0, 'occurredOn'>) {
      super(new WalletId(data.aggregateId.value));
      this.apiKeys = new ApiKeys({
        public: data.apiKeys.public,
        secret: new EncryptedValue(data.apiKeys.secret.value)
      });
    }
  }
}

import assert from 'assert';
import AggregateRoot from '@ddd-framework/eventsourcing/src/AggregateRoot';
import Address from '../common/Address';
import ApiKeys from './ApiKeys';
import UserProfile from './UserProfile';
import WalletId from './WalletId';
import * as Commands from './Commands';
import * as Events from './Events';
import EncryptionService, {
  EncryptionKeys
} from '../services/EncryptionService';
import EncryptedValue from '../common/EncryptedValue';
import { Network } from '../Network';

export default class Wallet extends AggregateRoot<
  WalletId,
  Events.WalletEvents
> {
  public id: WalletId = WalletId.Null;

  public owner: Address = Address.Null;

  public network: Network = Network.Null;

  public areTermsOfServiceSigned: boolean = false;

  public apiKeys: ApiKeys = ApiKeys.Null;

  public userProfile: UserProfile = UserProfile.Null;

  public connect(cmd: Commands.ConnectWallet.V0): void {
    this.apply(
      new Events.WalletConnected.V0({
        owner: cmd.owner,
        network: cmd.network,
        aggregateId: cmd.aggregateId
      })
    );
  }

  public signToS(cmd: Commands.SignToS.V0) {
    this.apply(
      new Events.TermsOfServiceSigned.V0({
        aggregateId: cmd.aggregateId
      })
    );
  }

  public registerUser(cmd: Commands.RegisterUser.V0) {
    this.apply(
      new Events.UserRegistered.V0({
        aggregateId: cmd.aggregateId,
        userFirstName: cmd.userFirstName,
        userLastName: cmd.userLastName,
        userEmail: cmd.userEmail
      })
    );
  }

  public updateUserProfile(cmd: Commands.UpdateUserProfile.V0) {
    this.apply(
      new Events.UserProfileUpdated.V0({
        aggregateId: cmd.aggregateId,
        userFirstName: cmd.userFirstName,
        userLastName: cmd.userLastName
      })
    );
  }

  public async generateApiKeys(
    cmd: Commands.GenerateApiKeys.V0,
    encryptionService: EncryptionService
  ): Promise<EncryptionKeys> {
    const [apiKeys, encryptionKeys] = await ApiKeys.generateNewKeys(
      encryptionService
    );

    this.apply(
      new Events.ApiKeysGenerated.V0({
        aggregateId: cmd.aggregateId,
        apiKeys
      })
    );

    return encryptionKeys;
  }

  protected validateInvariants(): void {
    assert(
      this.apiKeys.secret instanceof EncryptedValue,
      'Secret key has to be an EncryptedValue.'
    );
  }

  protected when(event: Events.WalletEvents): void {
    if (event instanceof Events.WalletConnected.V0) {
      this.id = event.aggregateId;
      this.owner = event.owner;
      this.network = event.network;
    } else if (event instanceof Events.TermsOfServiceSigned.V0) {
      this.id = event.aggregateId;
      this.areTermsOfServiceSigned = true;
    } else if (event instanceof Events.UserRegistered.V0) {
      this.id = event.aggregateId;
      this.userProfile = new UserProfile({
        email: event.userEmail,
        firstName: event.userFirstName,
        lastName: event.userLastName
      });
    } else if (event instanceof Events.UserProfileUpdated.V0) {
      this.userProfile = new UserProfile({
        email: this.userProfile.email,
        firstName: event.userFirstName,
        lastName: event.userLastName
      });
    } else if (event instanceof Events.ApiKeysGenerated.V0) {
      this.apiKeys = event.apiKeys;
    }
  }
}

import AggregateRoot from 'ddd-framework-eventsourcing/src/AggregateRoot';
import Address from '../common/Address';
import { ApiKeys } from './ApiKeys';
import { UserProfile } from './UserProfile';
import WalletId from './WalletId';

export default class Wallet extends AggregateRoot<WalletId> {
  public owner: Address = Address.Null;

  public apiKeys: ApiKeys = ApiKeys.Null;

  public userProfile: UserProfile = UserProfile.Null;
}

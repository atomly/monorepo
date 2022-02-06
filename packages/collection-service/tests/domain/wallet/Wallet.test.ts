import faker from '@faker-js/faker';
import Address from '../../../src/core/domain/common/Address';
import EncryptedValue from '../../../src/core/domain/common/EncryptedValue';
import { Network } from '../../../src/core/domain/Network';
import ApiKeys from '../../../src/core/domain/wallet/ApiKeys';
import * as Commands from '../../../src/core/domain/wallet/Commands';
import * as Events from '../../../src/core/domain/wallet/Events';
import Wallet from '../../../src/core/domain/wallet/Wallet';
import WalletId from '../../../src/core/domain/wallet/WalletId';
import UserProfile from '../../../src/core/domain/wallet/UserProfile';
import EcCryptoJsEncryptionService from '../../../src/infrastructure/adapters/driven/EcCryptoJsEncryptionService';

describe('Wallet', () => {
  const encryptionService = new EcCryptoJsEncryptionService();

  test('load aggregate from event stream', () => {
    const walletId = new WalletId(faker.datatype.uuid());
    const owner = Address.Null;
    const userEmail = faker.internet.email();
    const userFirstName = faker.name.firstName();
    const userLastName = faker.name.lastName();
    const apiKeys = new ApiKeys({
      public: faker.datatype.uuid(),
      secret: new EncryptedValue(faker.random.uuid())
    });

    // Pretend this comes from an EventStore:
    const stream: Events.WalletEvents[] = [
      new Events.WalletConnected.V0({
        aggregateId: walletId,
        owner,
        network: Network.Ethereum
      }),
      new Events.TermsOfServiceSigned.V0({ aggregateId: walletId }),
      new Events.UserRegistered.V0({
        aggregateId: walletId,
        userFirstName: faker.name.firstName(),
        userLastName: faker.name.lastName(),
        userEmail: userEmail
      }),
      new Events.UserProfileUpdated.V0({
        aggregateId: walletId,
        userFirstName: userFirstName,
        userLastName: userLastName
      }),
      new Events.ApiKeysGenerated.V0({
        aggregateId: walletId,
        apiKeys
      })
    ];

    const wallet = new Wallet();

    wallet.load(stream);

    expect(wallet.id.equals(walletId)).toBe(true);
    expect(wallet.owner.equals(owner)).toBe(true);
    expect(wallet.network).toBe(Network.Ethereum);
    expect(wallet.areTermsOfServiceSigned).toBe(true);
    expect(
      wallet.userProfile.equals(
        new UserProfile({
          email: userEmail,
          firstName: userFirstName,
          lastName: userLastName
        })
      )
    ).toBe(true);
    expect(wallet.apiKeys.equals(apiKeys)).toBe(true);

    expect(wallet.version).toBe(4); // Starts at -1, increases 1 per event.
  });

  test('instantiates to null', () => {
    const wallet = new Wallet();

    expect(wallet.id).toBe(WalletId.Null);
    expect(wallet.owner).toBe(Address.Null);
    expect(wallet.network).toBe(Network.Null);
    expect(wallet.areTermsOfServiceSigned).toBe(false);
    expect(wallet.userProfile).toBe(UserProfile.Null);
    expect(wallet.apiKeys).toBe(ApiKeys.Null);
  });

  test('full wallet command flow', async () => {
    const walletId = new WalletId(faker.datatype.uuid());
    const owner = Address.Null;

    const wallet = new Wallet();

    wallet.connect(
      new Commands.ConnectWallet.V0({
        aggregateId: walletId,
        owner,
        network: Network.Ethereum
      })
    );

    wallet.signToS(
      new Commands.SignToS.V0({
        aggregateId: walletId
      })
    );

    wallet.registerUser(
      new Commands.RegisterUser.V0({
        aggregateId: walletId,
        userFirstName: faker.name.firstName(),
        userLastName: faker.name.lastName(),
        userEmail: faker.internet.email()
      })
    );

    wallet.updateUserProfile(
      new Commands.UpdateUserProfile.V0({
        aggregateId: walletId,
        userFirstName: faker.name.firstName(),
        userLastName: faker.name.lastName()
      })
    );

    await wallet.generateApiKeys(
      new Commands.GenerateApiKeys.V0({
        aggregateId: walletId
      }),
      encryptionService
    );

    wallet.updateUserProfile(
      new Commands.UpdateUserProfile.V0({
        aggregateId: walletId,
        userFirstName: faker.name.firstName(),
        userLastName: faker.name.lastName()
      })
    );

    expect(wallet.id).not.toBe(WalletId.Null);
    expect(wallet.owner).not.toBe(Address.Null);
    expect(wallet.network).not.toBe(Network.Null);
    expect(wallet.areTermsOfServiceSigned).not.toBe(false);
    expect(wallet.userProfile).not.toBe(UserProfile.Null);
    expect(wallet.apiKeys).not.toBe(ApiKeys.Null);

    const changes = wallet.getChanges();

    expect(changes[0]).toBeInstanceOf(Events.WalletConnected.V0);
    expect(changes[1]).toBeInstanceOf(Events.TermsOfServiceSigned.V0);
    expect(changes[2]).toBeInstanceOf(Events.UserRegistered.V0);
    expect(changes[3]).toBeInstanceOf(Events.UserProfileUpdated.V0);
    expect(changes[4]).toBeInstanceOf(Events.ApiKeysGenerated.V0);
    expect(changes[5]).toBeInstanceOf(Events.UserProfileUpdated.V0);

    expect(wallet.version).toBe(-1 + changes.length); // Starts at -1, increases 1 per event.
  });

  test('invariants are validated', () => {
    const walletId = new WalletId(faker.datatype.uuid());
    const owner = Address.Null;

    const wallet = new Wallet();

    wallet.connect(
      new Commands.ConnectWallet.V0({
        aggregateId: walletId,
        owner,
        network: Network.Ethereum
      })
    );

    wallet.signToS(
      new Commands.SignToS.V0({
        aggregateId: walletId
      })
    );

    // @ts-ignore
    wallet.apiKeys.secret = faker.datatype.uuid();

    expect(() =>
      wallet.registerUser(
        new Commands.RegisterUser.V0({
          aggregateId: walletId,
          userFirstName: faker.name.firstName(),
          userLastName: faker.name.lastName(),
          userEmail: faker.internet.email()
        })
      )
    ).toThrow();
  });
});

import { EventStore } from 'ddd-framework-eventsourcing/src/EventStore';
import EncryptionService from '../domain/services/EncryptionService';
import Wallet from '../domain/wallet/Wallet';
import * as Events from '../domain/wallet/Events';
import * as WalletUseCases from '../ports/primary/WalletUseCases';

export default class WalletApplicationService
  implements
    WalletUseCases.ConnectWallet.UseCase,
    WalletUseCases.RegisterUser.UseCase
{
  // event store for accessing event streams
  private eventStore: EventStore;

  // domain service that is neeeded by aggregate
  private encryptionService: EncryptionService;

  // pass dependencies for this application service via constructor
  constructor(eventStore: EventStore, encryption: EncryptionService) {
    this.eventStore = eventStore;
    this.encryptionService = encryption;
  }

  // Step 1: connect method of Wallet Application Service is called
  public async connect(
    input: WalletUseCases.ConnectWallet.Input
  ): Promise<WalletUseCases.ConnectWallet.Output> {
    // Step 2.1: Load event stream for Wallet, given its id
    const stream = await this.eventStore.loadEventStream<Events.WalletEvents>(
      input.aggregateId
    );

    // Step 2.2: Build aggregate from event stream
    const wallet = new Wallet();
    wallet.load(stream.events);

    // Step 3: Call aggregate method, passing it arguments
    wallet.connect(input);

    // Step 4: Commit changes to the event stream by id
    await this.eventStore.appendToEventStream(
      wallet.id,
      stream.version,
      wallet.getChanges()
    );
  }

  public async register(
    input: WalletUseCases.RegisterUser.Input
  ): Promise<WalletUseCases.RegisterUser.Output> {
    const stream = await this.eventStore.loadEventStream<Events.WalletEvents>(
      input.aggregateId
    );

    const wallet = new Wallet();
    wallet.load(stream.events);
    wallet.registerUser(input);

    await this.eventStore.appendToEventStream(
      wallet.id,
      stream.version,
      wallet.getChanges()
    );
  }

  // ...
}

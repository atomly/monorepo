import { EventStoreDBClient } from '@eventstore/db-client';
import { AggregateStore } from 'ddd-framework-eventsourcing/src/AggregateStore';
import Identity from 'ddd-framework-core/src/Identity';
import AggregateRoot from 'ddd-framework-eventsourcing/src/AggregateRoot';
import { EsStoreEvent } from './EsStoreEvent';

export default class EsAggregateStore implements AggregateStore {
  private client: EventStoreDBClient;

  constructor(
    ...clientParameters: ConstructorParameters<typeof EventStoreDBClient>
  ) {
    this.client = new EventStoreDBClient(...clientParameters);
  }

  public async save<Aggregate extends AggregateRoot>(
    anAggregate: Aggregate
  ): Promise<void> {
    const storeEvents = anAggregate.getChanges().map(EsStoreEvent.serialize);

    const res = await this.client.appendToStream(
      anAggregate.id.toString(),
      storeEvents,
      {
        expectedRevision: BigInt(anAggregate.version)
      }
    );

    anAggregate.clearChanges();

    console.debug('[save/appendToEventStream]: ', res);
  }

  public async load<Aggregate extends AggregateRoot>(
    anId: Identity,
    anAggregate: Aggregate
  ): Promise<Aggregate> {
    const res = this.client.readStream(anId.toString());

    console.debug('[exists/readStream]: ', res);

    for await (const { event } of res) {
      if (event?.isJson) {
        const domainEvent = EsStoreEvent.deserialize(event);
        anAggregate.load(domainEvent);
      }
    }

    return anAggregate;
  }

  public async exists<Id extends Identity>(anId: Id): Promise<boolean> {
    let exists = false;

    const res = this.client.readStream(anId.toString(), { maxCount: 1 });

    console.debug('[exists/readStream]: ', res);

    for await (const { event } of res) if (event?.isJson) exists = true;

    return exists;
  }
}

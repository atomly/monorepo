import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { EventStream } from 'ddd-framework-eventsourcing/src/EventStream';
import { EventStore } from 'ddd-framework-eventsourcing/src/EventStore';
import Identity from 'ddd-framework-core/src/Identity';
import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import { EsStoreEvent } from './EsStoreEvent';

export default class EsEventStore implements EventStore {
  private client: EventStoreDBClient;

  constructor(
    ...clientParameters: ConstructorParameters<typeof EventStoreDBClient>
  ) {
    this.client = new EventStoreDBClient(...clientParameters);
  }

  public loadEventStream<Event extends DomainEvent>(
    anId: Identity
  ): Promise<EventStream<Event>>;

  public loadEventStream<Event extends DomainEvent>(
    anId: Identity,
    skipEvents: number,
    maxCount: number
  ): Promise<EventStream<Event>>;

  public async loadEventStream<Event extends DomainEvent>(
    anId: Identity,
    skipEvents?: number,
    maxCount?: number
  ): Promise<EventStream<Event>> {
    const events = this.client.readStream(anId.toString(), {
      fromRevision: skipEvents ? BigInt(skipEvents) : START,
      direction: FORWARDS,
      maxCount: maxCount
    });

    const eventStream = new EventStream<Event>(0, []);

    for await (const { event } of events) {
      if (event?.isJson)
        eventStream.events.push(EsStoreEvent.deserialize(event));
    }

    eventStream.version = Number(
      eventStream.events[eventStream.events.length - 1].metadata.eventVersion
    );

    return eventStream;
  }

  public async appendToEventStream<Stream extends EventStream<DomainEvent>>(
    anId: Identity,
    version: Stream['version'],
    events: Stream['events']
  ): Promise<void> {
    const storeEvents = events.map(EsStoreEvent.serialize);

    const res = await this.client.appendToStream(anId.toString(), storeEvents, {
      expectedRevision: BigInt(version)
    });

    console.debug('[appendToEventStream]: ', res);
  }
}

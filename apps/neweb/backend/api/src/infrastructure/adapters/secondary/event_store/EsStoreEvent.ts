import {
  JSONEventData,
  jsonEvent,
  JSONRecordedEvent,
  JSONType
} from '@eventstore/db-client';
import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import StoreEvent from 'ddd-framework-core/src/StoreEvent';
import { v4 as uuidv4 } from 'uuid';
import DomainEventClassMap from './DomainEventClassMap';
import { DataTransferObject } from 'ddd-framework-core/src/utils/DataTransferObject';
import { assert } from 'eccrypto-js';

export class EsStoreEvent extends StoreEvent<string> {
  public readonly eventId: string | number;

  public readonly eventType: string | number;

  public readonly eventVersion: string | number;

  public readonly eventBody: string;

  public readonly occurredOn: Date;

  private constructor(aStoreEventDto: DataTransferObject<StoreEvent<string>>) {
    super();
    this.eventId = aStoreEventDto.eventId;
    this.eventType = aStoreEventDto.eventType;
    this.eventVersion = aStoreEventDto.eventVersion;
    this.eventBody = aStoreEventDto.eventBody;
    this.occurredOn = new Date(aStoreEventDto.occurredOn);
  }

  /**
   * Serializes the DomainEvent instance. Used in the constructor.
   * @param aDomainEvent - Aggregate or Entity DomainEvent.
   */
  public static serialize<Event extends DomainEvent>(
    aDomainEvent: Event
  ): JSONEventData {
    const storeEvent = new EsStoreEvent({
      eventId: uuidv4(),
      eventType: aDomainEvent.metadata.eventType,
      eventVersion: aDomainEvent.metadata.eventVersion,
      eventBody: JSON.stringify(aDomainEvent),
      occurredOn: aDomainEvent.metadata.occurredOn.toISOString()
    });

    return jsonEvent({
      type: String(storeEvent),
      data: storeEvent as unknown as JSONType
    });
  }

  /**
   * Deserializes the `eventBody` into its repective DomainEvent instance.
   */
  public static deserialize<Event extends DomainEvent>(
    aJSONRecordedEvent: JSONRecordedEvent
  ): Event {
    assert(
      typeof aJSONRecordedEvent.data === 'string',
      'JSONRecordedEvent.data has to be of type string.'
    );

    const storeEventDto: DataTransferObject<StoreEvent<string>> = JSON.parse(
      aJSONRecordedEvent.data as string
    );

    const storeEvent = new EsStoreEvent(storeEventDto);

    const DomainEventClass =
      DomainEventClassMap.getDomainEventClassBy(storeEvent);

    if (!DomainEventClass)
      throw new Error(
        `No Domain Event Class found for event type ${storeEvent.eventType} and version ${storeEvent.eventVersion}.`
      );

    const event = new DomainEventClass(JSON.parse(storeEvent.eventBody));

    return event as Event;
  }
}

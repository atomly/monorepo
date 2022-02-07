import { v4 as uuidv4 } from 'uuid';
import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import StoreEvent, {
  SerializedDomainEvent
} from 'ddd-framework-core/src/StoreEvent';
import DomainEventClassMap from './DomainEventClassMap';

type EsStoreEventId = string;

export class EsStoreEvent extends StoreEvent<EsStoreEventId> {
  public eventId: EsStoreEventId;

  constructor(aDomainEvent: DomainEvent) {
    super(aDomainEvent);
    this.eventId = uuidv4();
  }

  public serialize<Event extends DomainEvent>(
    aDomainEvent: Event
  ): SerializedDomainEvent {
    return JSON.stringify(aDomainEvent);
  }

  public deserialize<Event extends DomainEvent>(): Event {
    const DomainEventClass = DomainEventClassMap.getDomainEventClassBy(this);

    if (!DomainEventClass)
      throw new Error(
        `No Domain Event Class found for event type ${this.eventType} and version ${this.eventVersion}.`
      );

    const event = new DomainEventClass(JSON.parse(this.eventBody));

    return event as Event;
  }
}

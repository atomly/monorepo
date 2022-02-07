import { ClassOf } from './ClassOf';
import DomainEvent, { DomainEventMetadata } from '../DomainEvent';

type DomainEventMetadataIndexes = Omit<DomainEventMetadata, 'occurredOn'>;

type Unpack<T> = T extends (infer U)[] ? U : never;

type KeyedByDomainEventMetadata<T extends DomainEventMetadataIndexes[]> = {
  [Type in Unpack<T>['eventType']]: {
    [Version in Unpack<T>['eventVersion']]: Extract<
      Unpack<T>,
      { eventType: Type; eventVersion: Version }
    >;
  };
};

type DomainEventClass<Event extends DomainEvent = DomainEvent> =
  ClassOf<Event> & DomainEventMetadataIndexes;

export interface IDomainEventClassMap<
  DomainEventClasses extends DomainEventClass[]
> {
  getDomainEventClassBy(
    aDomainEventMetadata: DomainEventMetadataIndexes
  ): Unpack<DomainEventClasses> | null;
}

class __DomainEventClassMap<DomainEventClasses extends DomainEventClass[]>
  implements IDomainEventClassMap<DomainEventClasses>
{
  constructor(...domainEventClasses: DomainEventClasses) {
    this.setup(...domainEventClasses);
  }

  private setup(...domainEventClasses: DomainEventClasses): void {
    domainEventClasses.forEach(async (event) => {
      const self = this as Record<PropertyKey, any>;

      const eventType =
        event.eventType as keyof KeyedByDomainEventMetadata<DomainEventClasses>;

      const eventVersion =
        event.eventVersion as keyof KeyedByDomainEventMetadata<DomainEventClasses>;

      if (!self[eventType]) self[eventType] = {};

      if (!self[eventType][eventVersion]) self[eventType][eventVersion] = event;
      else
        throw new Error(
          `A duplicated event of type "${eventType}" and version "${eventVersion}" was found. Check that your event type and version combinations are unique.`
        );
    });
  }

  public getDomainEventClassBy(
    aDomainEventMetadata: DomainEventMetadataIndexes
  ): Unpack<DomainEventClasses> | null {
    const self = this as Record<PropertyKey, any>;

    const event =
      self[aDomainEventMetadata.eventVersion] &
      self[aDomainEventMetadata.eventVersion][aDomainEventMetadata.eventType];

    return (event || null) as Unpack<DomainEventClasses> | null;
  }
}

type DomainEventClassMap = new <
  DomainEventClasses extends ConstructorParameters<typeof __DomainEventClassMap>
>(
  ...domainEventClasses: DomainEventClasses
) => IDomainEventClassMap<DomainEventClasses> &
  KeyedByDomainEventMetadata<DomainEventClasses>;

const DomainEventClassMap = __DomainEventClassMap as DomainEventClassMap;

export default DomainEventClassMap;

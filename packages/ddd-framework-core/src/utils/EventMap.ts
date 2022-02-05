import { ClassOf } from './ClassOf';
import DomainEvent from '../DomainEvent';

interface TypeName {
  EventType: string;
}

type Unpack<T> = T extends (infer U)[] ? U : never;

type KeyedByName<T extends TypeName[]> = {
  [K in Unpack<T>['EventType']]: Extract<Unpack<T>, { EventType: K }>;
};

class __EventMap<
  MappedDomainEvent extends (ClassOf<DomainEvent> & TypeName)[]
> {
  private __mappedDomainEvents: MappedDomainEvent;

  constructor(...mappedDomainEvents: MappedDomainEvent) {
    this.__mappedDomainEvents = mappedDomainEvents;
    this.setup();
  }

  public async setup(): Promise<void> {
    this.__mappedDomainEvents.map(async (event) => {
      const key = event.EventType as keyof KeyedByName<MappedDomainEvent>;

      if (!this[key as keyof this]) {
        Object.assign(this, { [key]: event });
      } else {
        throw new Error(
          `A duplicated event of type "${key}" was found. Check that your event types are unique.`
        );
      }
    });
  }
}

const EventMap = __EventMap as new <
  MappedDomainEvent extends ConstructorParameters<typeof __EventMap>
>(
  ...mappedDomainEvents: MappedDomainEvent
) => KeyedByName<MappedDomainEvent>;

export default EventMap;

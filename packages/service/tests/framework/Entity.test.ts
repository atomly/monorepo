import faker from '@faker-js/faker';
import Entity from '../../src/framework/Entity';
import ValueObject from '../../src/framework/ValueObject';

class ArgumentOutOfRangeException<Class extends object = object> extends Error {
  constructor(argument: keyof Class, error: string) {
    super(`${argument} - ${error}`);
  }
}

class PictureSize extends ValueObject {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    super();

    if (width <= 0)
      throw new ArgumentOutOfRangeException<PictureSize>(
        'width',
        'Picture width must be a positive number'
      );

    if (height <= 0)
      throw new ArgumentOutOfRangeException<PictureSize>(
        'height',
        'Picture height must be a positive number'
      );

    this.width = width;
    this.height = height;
  }
}

class PictureId extends ValueObject {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  public static Null = new PictureId('');
}

interface DomainEventMetadata {
  occurredOn: Date;
}

abstract class DomainEvent<Data> {
  public static EventType: string;

  public readonly type: string;

  public readonly id: string;

  public readonly aggregateId: string;

  public abstract data: Data;

  public metadata: DomainEventMetadata;

  constructor(
    id: string,
    type: string,
    aggregateId: string,
    occurredOn: DomainEventMetadata['occurredOn'] = new Date()
  ) {
    this.id = id;
    this.type = type;
    this.aggregateId = aggregateId;
    this.metadata = { occurredOn };
  }
}

type UserRegisteredEventData = { userEmailAddress: string };

class UserRegistered extends DomainEvent<UserRegisteredEventData> {
  public static EventType = 'UserRegistered';

  public data: UserRegisteredEventData;

  constructor(
    id: string,
    aggregateId: string,
    data: UserRegisteredEventData,
    occurredOn?: Date
  ) {
    super(UserRegistered.EventType, id, aggregateId, occurredOn);
    this.data = data;
  }
}

type PictureCreatedEventData = {
  pictureId: string;
  height: number;
  width: number;
  uri: string;
};

class PictureCreated extends DomainEvent<PictureCreatedEventData> {
  public static EventType = 'PictureCreated';

  public data: PictureCreatedEventData;

  constructor(
    id: string,
    aggregateId: string,
    data: PictureCreatedEventData,
    occurredOn?: Date
  ) {
    super(PictureCreated.EventType, id, aggregateId, occurredOn);
    this.data = data;
  }
}

type PictureResizedEventData = {
  pictureId: string;
  height: number;
  width: number;
};

class PictureResized extends DomainEvent<PictureResizedEventData> {
  public static EventType = 'PictureCreated';

  public data: PictureResizedEventData;

  constructor(
    id: string,
    aggregateId: string,
    data: PictureResizedEventData,
    occurredOn?: Date
  ) {
    super(PictureResized.EventType, id, aggregateId, occurredOn);
    this.data = data;
  }
}

const PictureEvents = {
  UserRegistered,
  PictureCreated,
  PictureResized
};

type Class = new (...args: any) => any;

type EventOf<EventMap extends Record<string, unknown>> =
  EventMap[keyof EventMap] extends Class
    ? InstanceType<EventMap[keyof EventMap]>
    : never;

class Uri extends ValueObject {
  public uri: string;
  constructor(uri: string) {
    super();
    this.uri = uri;
  }
}

class Picture extends Entity<PictureId, EventOf<typeof PictureEvents>> {
  private size: PictureSize;
  private uri: Uri;

  constructor(pictureId: PictureId, size: PictureSize, uri: Uri) {
    super(pictureId);
    this.size = size;
    this.uri = uri;
  }

  protected When(event: EventOf<typeof PictureEvents>) {
    switch (true) {
      case event instanceof PictureEvents.PictureCreated: {
        const e = event as PictureCreated;
        this.size = new PictureSize(e.data.width, e.data.height);
        this.uri = new Uri(e.data.uri);
        break;
      }
      case event instanceof PictureEvents.PictureResized: {
        const e = event as PictureResized;
        this.size = new PictureSize(e.data.width, e.data.height);
        break;
      }
    }
  }

  public resize(newSize: PictureSize) {
    // TODO: Use apply, not handle.
    this.handle(
      // TODO: What to do with event and aggregate IDs
      new PictureEvents.PictureResized('', '', {
        pictureId: this.id.id,
        width: this.size.width,
        height: this.size.height
      })
    );
  }
}

describe('UserProfile', () => {
  describe('events', () => {
    test('handle(event: UserRegistered)', () => {
      const userProfileId = new UserProfileId(faker.datatype.uuid());

      const userProfile = new UserProfile(userProfileId);

      const userRegisteredEvent = new UserRegistered(
        userProfileId,
        faker.name.findName(),
        faker.internet.userName()
      );

      console.log('userRegisteredEvent: ', userRegisteredEvent);

      userProfile.handle(userRegisteredEvent);
    });
  });
});

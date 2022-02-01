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

class PictureId {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  public static Null = '';
}

interface DomainEventMetadata {
  occurredOn: Date;
}

export abstract class DomainEvent<Data> {
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
  pictureId: PictureId;
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
  pictureId: PictureId;
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

// class Picture extends Entity<PictureId>
// {
//     internal PictureSize Size { get; private set; }
//     internal Uri Location { get; private set; }
//     internal int Order { get; private set; }

//     protected override void When(object @event)
//     {
//         switch (@event)
//         {
//             case Events.PictureAddedToAClassifiedAd e:
//                 ParentId = new ClassifiedAdId(e.ClassifiedAdId);
//                 Id = new PictureId(e.PictureId);
//                 Location = new Uri(e.Url);
//                 Size = new PictureSize { Height = e.Height, Width = e.Width };
//                 Order = e.Order;
//                 break;
//             case Events.ClassifiedAdPictureResized e:
//                 Size = new PictureSize { Height = e.Height, Width = e.Width };
//                 break;
//         }
//     }

//     public void Resize(PictureSize newSize)
//         => Apply(new Events.ClassifiedAdPictureResized
//         {
//             PictureId = Id.Value,
//             ClassifiedAdId = ParentId,
//             Height = newSize.Width,
//             Width = newSize.Width
//         });

//     public Picture(Action<object> applier) : base(applier)
//     {
//     }
// }

// public class PictureId : Value<PictureId>
// {
//     public PictureId(Guid value) => Value = value;

//     public Guid Value { get; }
// }

// const UserEvents = {
//   UserRegistered,
//   ProfilePhotoUploaded,
//   UserFullNameUpdated,
//   UserDisplayNameUpdated
// };

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

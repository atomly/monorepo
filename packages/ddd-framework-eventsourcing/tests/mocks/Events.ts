import DomainEvent from 'collection-service/src/framework/DomainEvent';
import PictureId from './PictureId';
import PictureSize from './PictureSize';
import Uri from './Uri';

export namespace Events {
  export class UserRegistered extends DomainEvent {
    public userEmailAddress: string;

    constructor(entityId: string, userEmailAddress: string) {
      super(entityId);
      this.userEmailAddress = userEmailAddress;
    }

    public static readonly EventType = 'UserRegistered';

    public static readonly EventVersion = 0;
  }

  export class PictureCreated extends DomainEvent {
    public height: number;

    public width: number;

    public uri: string;

    constructor(entityId: PictureId, size: PictureSize, uri: Uri) {
      super(entityId.id);
      this.height = size.height;
      this.width = size.width;
      this.uri = uri.uri;
    }

    public static readonly EventType = 'PictureCreated';

    public static readonly EventVersion = 0;
  }

  export class PictureResized extends DomainEvent {
    public height: number;

    public width: number;

    constructor(entityId: PictureId, size: PictureSize) {
      super(entityId.id);
      this.height = size.height;
      this.width = size.width;
    }

    public static readonly EventType = 'PictureResized';

    public static readonly EventVersion = 0;
  }

  export type PictureEvents = UserRegistered | PictureCreated | PictureResized;
}

import DomainEvent from 'ddd-framework-core/src/DomainEvent';
import Identity from 'ddd-framework-core/src/Identity';

export class PictureCreated extends DomainEvent<Identity> {
  public pictureId: string;

  public height: number;

  public width: number;

  public uri: string;

  constructor(
    aggregateId: Identity,
    pictureId: string,
    width: number,
    height: number,
    uri: string
  ) {
    super(aggregateId);
    this.pictureId = pictureId;
    this.height = height;
    this.width = width;
    this.uri = uri;
  }

  public static readonly eventType = 'PictureCreated';

  public static readonly eventVersion = 0;
}

export class PictureResized extends DomainEvent<Identity> {
  public pictureId: string;

  public height: number;

  public width: number;

  constructor(
    aggregateId: Identity,
    pictureId: string,
    width: number,
    height: number
  ) {
    super(aggregateId);
    this.pictureId = pictureId;
    this.height = height;
    this.width = width;
  }

  public static readonly eventType = 'PictureResized';

  public static readonly eventVersion = 0;
}

export type PictureEvents = PictureCreated | PictureResized;

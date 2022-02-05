import DomainEvent from 'ddd-framework-core/src/DomainEvent';

export class PictureCreated extends DomainEvent {
  public pictureId: string;

  public height: number;

  public width: number;

  public uri: string;

  constructor(
    aggregateId: string,
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

  public static readonly EventType = 'PictureCreated';

  public static readonly EventVersion = 0;
}

export class PictureResized extends DomainEvent {
  public pictureId: string;

  public height: number;

  public width: number;

  constructor(
    aggregateId: string,
    pictureId: string,
    width: number,
    height: number
  ) {
    super(aggregateId);
    this.pictureId = pictureId;
    this.height = height;
    this.width = width;
  }

  public static readonly EventType = 'PictureResized';

  public static readonly EventVersion = 0;
}

export type PictureEvents = PictureCreated | PictureResized;

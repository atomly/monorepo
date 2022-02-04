import { Action } from '../../src/Action';
import EventSourcedEntity from '../../src/EventSourcedEntity';
import * as Events from './PictureEvents';
import PictureId from './PictureId';
import PictureSize from './PictureSize';
import Uri from './Uri';

export default class Picture extends EventSourcedEntity<
  PictureId,
  Events.PictureEvents
> {
  public id: PictureId;

  public size: PictureSize;

  public uri: Uri;

  constructor(applier: Action<unknown>) {
    super(applier);
    this.id = PictureId.Null;
    this.size = PictureSize.Null;
    this.uri = Uri.Null;
  }

  protected when(event: Events.PictureEvents) {
    if (event instanceof Events.PictureCreated) {
      this.id = new PictureId(event.entityId);
      this.size = new PictureSize(event.width, event.height);
      this.uri = new Uri(event.uri);
    } else if (event instanceof Events.PictureResized) {
      this.size = new PictureSize(event.width, event.height);
    }
  }

  public create(id: PictureId, size: PictureSize, uri: Uri) {
    this.applyChange(new Events.PictureCreated(id, size, uri));
  }

  public resize(size: PictureSize) {
    this.applyChange(new Events.PictureResized(this.id, size));
  }
}

import Identity from 'collection-service/src/framework/Identity';
import { Action } from '../../src/Action';
import Entity from '../../src/Entity';
import * as Events from './PictureEvents';
import PictureId from './PictureId';
import PictureSize from './PictureSize';
import Uri from './Uri';

class ParentId extends Identity {
  public static Null = new ParentId('');
}

export default class Picture extends Entity<PictureId, Events.PictureEvents> {
  public parentId: ParentId = ParentId.Null;

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
      this.parentId = new ParentId(event.aggregateId);
      this.id = new PictureId(event.pictureId);
      this.size = new PictureSize(event.width, event.height);
      this.uri = new Uri(event.uri);
    } else if (event instanceof Events.PictureResized) {
      this.size = new PictureSize(event.width, event.height);
    }
  }

  public resize(width: number, height: number) {
    this.applyChange(
      new Events.PictureResized(
        this.parentId.value,
        this.id.value,
        width,
        height
      )
    );
  }
}

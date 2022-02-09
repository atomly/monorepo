import faker from '@faker-js/faker';
import Identity from '@ddd-framework/core/src/Identity';
import Picture from './mocks/Picture';
import * as Events from './mocks/PictureEvents';

describe('Entity', () => {
  const applier = jest.fn();

  afterEach(() => {
    applier.mockReset();
  });

  test('handles event', () => {
    const picture = new Picture(applier);

    const aggregateId = new AggregateId(faker.datatype.uuid());
    const pictureId = faker.datatype.uuid();
    const width = faker.datatype.number();
    const height = faker.datatype.number();
    const uri = faker.random.image();

    picture.mutate(
      new Events.PictureCreated(aggregateId, pictureId, width, height, uri)
    );

    // Child entity should handle event:
    expect(picture.id.value).toBe(pictureId);
    expect(picture.size.width).toBe(width);
    expect(picture.size.height).toBe(height);
    expect(picture.uri.uri).toBe(uri);
  });

  test('apply should handle event then proxy it to the applier', () => {
    const picture = new Picture(applier);

    const aggregateId = new AggregateId(faker.datatype.uuid());
    const pictureId = faker.datatype.uuid();
    const width = faker.datatype.number();
    const height = faker.datatype.number();
    const uri = faker.random.image();

    const event = new Events.PictureCreated(
      aggregateId,
      pictureId,
      width,
      height,
      uri
    );

    picture.apply(event);

    // Child entity should handle event:
    expect(picture.id.value).toBe(pictureId);
    expect(picture.size.width).toBe(width);
    expect(picture.size.height).toBe(height);
    expect(picture.uri.uri).toBe(uri);

    // Applier should receive the proxied child entity event:
    expect(applier).toHaveBeenCalled();
    expect(applier).toHaveBeenCalledWith(event);
  });

  test('apply should handle multiple events then proxy all of them to the applier', () => {
    const picture = new Picture(applier);

    const aggregateId = new AggregateId(faker.datatype.uuid());
    const pictureId = faker.datatype.uuid();
    const uri = faker.random.image();

    const pictureCreated = new Events.PictureCreated(
      aggregateId,
      pictureId,
      faker.datatype.number(),
      faker.datatype.number(),
      uri
    );

    picture.apply(pictureCreated);

    const width = faker.datatype.number();
    const height = faker.datatype.number();

    const pictureResized = new Events.PictureResized(
      aggregateId,
      pictureId,
      width,
      height
    );

    picture.apply(pictureResized);

    // Applier should receive the proxied child entity event:
    expect(applier).toHaveBeenCalledTimes(2);
    expect(applier.mock.calls[0][0]).toBe(pictureCreated);
    expect(applier.mock.calls[1][0]).toBe(pictureResized);

    // Child entity should handle events:
    expect(picture.id.value).toBe(pictureId);
    expect(picture.size.width).toBe(width);
    expect(picture.size.height).toBe(height);
    expect(picture.uri.uri).toBe(uri);
  });

  describe('Picture', () => {
    test('resize', () => {
      const picture = new Picture(applier);

      const aggregateId = new AggregateId(faker.datatype.uuid());
      const pictureId = faker.datatype.uuid();
      const uri = faker.random.image();

      const pictureCreated = new Events.PictureCreated(
        aggregateId,
        pictureId,
        faker.datatype.number(),
        faker.datatype.number(),
        uri
      );

      picture.apply(pictureCreated);

      const width = faker.datatype.number();
      const height = faker.datatype.number();

      picture.resize(width, height);

      // Child entity should handle events:
      expect(picture.id.value).toBe(pictureId);
      expect(picture.size.width).toBe(width);
      expect(picture.size.height).toBe(height);
      expect(picture.uri.uri).toBe(uri);

      // Applier should receive the proxied child entity event:
      expect(applier).toHaveBeenCalledTimes(2);
      expect(applier.mock.calls[0][0]).toBe(pictureCreated);
      expect(applier.mock.calls[1][0]).toBeInstanceOf(Events.PictureResized);
    });
  });
});

class AggregateId extends Identity {
  public static Null = new AggregateId('');
}

import faker from '@faker-js/faker';
import Picture from './mocks/Picture';
import PictureId from './mocks/PictureId';
import PictureSize from './mocks/PictureSize';
import Uri from './mocks/Uri';
import { Events } from './mocks/Events';

describe('EventSourcedEntity', () => {
  const applier = jest.fn();

  afterEach(() => {
    applier.mockReset();
  });

  test('apply should handle event then proxy it to the applier', () => {
    const picture = new Picture(applier);

    const id = new PictureId(faker.datatype.uuid());
    const size = new PictureSize(
      faker.datatype.number(),
      faker.datatype.number()
    );
    const uri = new Uri(faker.random.image());

    const event = new Events.PictureCreated(id, size, uri);

    picture.applyChange(event);

    // Child entity should handle event:
    expect(picture.id.equals(id)).toBe(true);
    expect(picture.size.equals(size)).toBe(true);
    expect(picture.uri.equals(uri)).toBe(true);

    // Applier should receive the proxied child entity event:
    expect(applier.mock.calls[0]).toHaveLength(1);
    expect(applier.mock.calls[0][0]).toBe(event);
  });

  test('handles event', () => {
    const picture = new Picture(applier);

    const id = new PictureId(faker.datatype.uuid());
    const size = new PictureSize(
      faker.datatype.number(),
      faker.datatype.number()
    );
    const uri = new Uri(faker.random.image());

    picture.handle(new Events.PictureCreated(id, size, uri));

    // Child entity should handle event:
    expect(picture.id.equals(id)).toBe(true);
    expect(picture.size.equals(size)).toBe(true);
    expect(picture.uri.equals(uri)).toBe(true);
  });

  describe('Picture', () => {
    describe('commands should be applied', () => {
      test('create', () => {
        const picture = new Picture(applier);

        const id = new PictureId(faker.datatype.uuid());
        const size = new PictureSize(
          faker.datatype.number(),
          faker.datatype.number()
        );
        const uri = new Uri(faker.random.image());

        picture.create(id, size, uri);

        // Child entity should handle event:
        expect(picture.id.equals(id)).toBe(true);
        expect(picture.size.equals(size)).toBe(true);
        expect(picture.uri.equals(uri)).toBe(true);

        // Applier should receive the proxied child entity event:
        expect(applier.mock.calls).toHaveLength(1);
        expect(applier.mock.calls[0][0]).toBeInstanceOf(Events.PictureCreated);
      });

      test('create then resize', () => {
        const picture = new Picture(applier);

        const id = new PictureId(faker.datatype.uuid());
        const size = new PictureSize(
          faker.datatype.number(),
          faker.datatype.number()
        );
        const uri = new Uri(faker.random.image());

        picture.create(id, size, uri);

        const newSize = new PictureSize(
          faker.datatype.number(),
          faker.datatype.number()
        );

        picture.resize(newSize);

        // Child entity should handle event:
        expect(picture.id.equals(id)).toBe(true);
        expect(picture.size.notEquals(size)).toBe(true);
        expect(picture.size.equals(newSize)).toBe(true);
        expect(picture.uri.equals(uri)).toBe(true);

        // Applier should receive the proxied child entity events:
        expect(applier.mock.calls).toHaveLength(2);
        expect(applier.mock.calls[0][0]).toBeInstanceOf(Events.PictureCreated);
        expect(applier.mock.calls[1][0]).toBeInstanceOf(Events.PictureResized);
      });
    });
  });
});

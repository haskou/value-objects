import { NullObjectError } from '../../../src/errors/NullObjectError';
import { Media } from '../../../src/value-objects/media/Media';
import { NullObject } from '../../../src/value-objects/NullObject';
import { UniqueObjectArray } from '../../../src/value-objects/UniqueObjectArray';

describe('Media', () => {
  const testContent = 'hello world';

  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        NullObject.isNullObject(new Media(undefined as unknown as string)),
      ).toBeTrue();
    });

    it('should create from a string', () => {
      const media = new Media(testContent);
      expect(media).toBeInstanceOf(Media);
      expect(media.valueOf()).toBe(testContent);
    });

    it('should create from a Buffer', () => {
      const media = new Media(Buffer.from(testContent));
      expect(media).toBeInstanceOf(Media);
      expect(media.valueOf()).toBe(testContent);
    });

    it('should preserve non-text bytes from a Buffer', () => {
      const source = Buffer.from([0xff, 0xfe, 0xfd, 0x00, 0x80]);
      const media = new Media(source);

      source[0] = 0x00;

      expect(media.getBuffer()).toEqual(
        Buffer.from([0xff, 0xfe, 0xfd, 0x00, 0x80]),
      );
    });
  });

  describe('getBuffer', () => {
    it('should return the content as a Buffer', () => {
      const media = new Media(testContent);
      const buffer = media.getBuffer();

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString()).toBe(testContent);
    });
  });

  describe('getSize', () => {
    it('should return the byte length of the content', () => {
      const media = new Media(testContent);
      expect(media.getSize()).toBe(Buffer.byteLength(testContent));
    });
  });

  describe('getBase64', () => {
    it('should return the content as a base64 string', () => {
      const media = new Media(testContent);
      const base64 = media.getBase64();

      expect(base64).toBe(Buffer.from(testContent).toString('base64'));
    });
  });

  describe('isEqual', () => {
    it('should compare Media instances using preserved bytes', () => {
      const media = new Media(Buffer.from([0xff]));
      const other = new Media(Buffer.from([0xfe]));

      expect(media.toString()).toBe(other.toString());
      expect(media.getBuffer()).not.toEqual(other.getBuffer());
      expect(media.isEqual(other)).toBeFalse();
    });

    it('should compare Media instances with the same bytes as equal', () => {
      const media = new Media(Buffer.from([0xff]));
      const other = new Media(Buffer.from([0xff]));

      expect(media.isEqual(other)).toBeTrue();
    });

    it('should compare Media instances with buffers using preserved bytes', () => {
      const media = new Media(Buffer.from([0xff]));

      expect(media.isEqual(Buffer.from([0xff]))).toBeTrue();
      expect(media.isEqual(Buffer.from([0xfe]))).toBeFalse();
    });

    it('should keep distinct binary payloads in unique collections', () => {
      const medias = UniqueObjectArray.fromArray([
        new Media(Buffer.from([0xff])),
        new Media(Buffer.from([0xfe])),
      ]);

      expect(medias.length()).toBe(2);
    });
  });

  describe('NullObject behavior', () => {
    it('should throw NullObjectError when calling methods on a null media', () => {
      const nullMedia = new Media(undefined as unknown as string);
      expect(() => nullMedia.getBuffer()).toThrow(NullObjectError);
    });
  });
});

import { NullObjectError } from '../../../src/errors/NullObjectError';
import { Media } from '../../../src/value-objects/media/Media';
import { NullObject } from '../../../src/value-objects/NullObject';

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

  describe('NullObject behavior', () => {
    it('should throw NullObjectError when calling methods on a null media', () => {
      const nullMedia = new Media(undefined as unknown as string);
      expect(() => nullMedia.getBuffer()).toThrow(NullObjectError);
    });
  });
});

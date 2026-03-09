import { InvalidFormatError } from '../../../src/errors/InvalidFormatError';
import { InvalidLengthError } from '../../../src/errors/InvalidLengthError';
import { NullObject } from '../../../src/value-objects/NullObject';
import { ShortId } from '../../../src/value-objects/ids/ShortId';

describe('ShortId', () => {
  describe('generate', () => {
    it('should generate a valid ShortId', () => {
      const id = ShortId.generate();
      expect(id).toBeInstanceOf(ShortId);
      expect(id.toString()).toHaveLength(24);
    });
  });
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        NullObject.isNullObject(new ShortId(undefined as unknown as string)),
      ).toBeTrue();
    });

    it('should throw invalid length error when constructor receives a empty string', () => {
      expect(() => new ShortId('')).toThrow(InvalidLengthError);
    });

    it('should throw invalid format when value is not a valid id', () => {
      expect(() => new ShortId('123')).toThrow(InvalidLengthError);
    });

    it("should be a valid id when it's 24 length string", () => {
      expect(() => new ShortId('12345678901234567890abcd')).not.toThrow();
      expect(new ShortId('12345678901234567890abcd')).toBeInstanceOf(ShortId);
    });

    it("should be invalid id when it's 24 length but invalid characters", () => {
      expect(() => new ShortId('123456789@123456789#abcd')).toThrow(
        InvalidFormatError,
      );
    });
  });
});

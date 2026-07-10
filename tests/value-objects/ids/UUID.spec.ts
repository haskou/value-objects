import { InvalidFormatError } from '../../../src/errors/InvalidFormatError';
import { InvalidLengthError } from '../../../src/errors/InvalidLengthError';
import { NullObject } from '../../../src/value-objects/NullObject';
import { UUID } from '../../../src/value-objects/ids/UUID';

describe('UUID', () => {
  describe('generate', () => {
    it('should generate a valid LongId', () => {
      const id = UUID.generate();
      expect(id).toBeInstanceOf(UUID);
      expect(id.toString()).toHaveLength(36);
      expect(id.toString()[14]).toBe('4');
      expect(['8', '9', 'a', 'b']).toContain(id.toString()[19]);
    });
  });
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(
        NullObject.isNullObject(new UUID(undefined as unknown as string)),
      ).toBeTrue();
    });

    it('should throw invalid length error when constructor receives a empty string', () => {
      expect(() => new UUID('')).toThrow(InvalidLengthError);
    });

    it('should throw invalid format when value is not a valid id', () => {
      expect(() => new UUID('123')).toThrow(InvalidLengthError);
    });

    it('should accept a structurally valid UUID', () => {
      expect(
        () => new UUID('8ab0b0f7-7324-4637-bc6b-109326f081c0'),
      ).not.toThrow();
      expect(new UUID('8ab0b0f7-7324-4637-bc6b-109326f081c0')).toBeInstanceOf(
        UUID,
      );
    });

    it('should reject 36-character strings without UUID structure', () => {
      expect(() => new UUID('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow(
        InvalidFormatError,
      );
    });

    it('should reject UUIDs with an invalid variant', () => {
      expect(() => new UUID('8ab0b0f7-7324-4637-7c6b-109326f081c0')).toThrow(
        InvalidFormatError,
      );
    });

    it.each([
      '00000000-0000-0000-0000-000000000000',
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
    ])('should accept the reserved sentinel UUID %s', (value) => {
      expect(new UUID(value).valueOf()).toBe(value);
    });

    it("should be invalid id when it's 36 length but invalid characters", () => {
      expect(() => new UUID('8ab0b0f7-7324#5637-bc6b-109326f081c0')).toThrow(
        InvalidFormatError,
      );
    });
  });
});

import { InvalidFormatError } from '../../../src/errors/InvalidFormatError';
import { InvalidLengthError } from '../../../src/errors/InvalidLengthError';
import { UUID } from '../../../src/value-objects/ids/UUID';

describe('UUID', () => {
  describe('generate', () => {
    it('should generate a valid LongId', () => {
      const id = UUID.generate();
      expect(id).toBeInstanceOf(UUID);
      expect(id.toString()).toHaveLength(36);
    });
  });
  describe('constructor', () => {
    it('should throw invalid length error when constructor receives a empty string', () => {
      expect(() => new UUID('')).toThrow(InvalidLengthError);
    });

    it('should throw invalid format when value is not a valid id', () => {
      expect(() => new UUID('123')).toThrow(InvalidLengthError);
    });

    it("should be a valid id when it's 36 length string", () => {
      expect(
        () => new UUID('8ab0b0f7-7324-4637-bc6b-109326f081c0'),
      ).not.toThrow();
      expect(new UUID('8ab0b0f7-7324-4637-bc6b-109326f081c0')).toBeInstanceOf(
        UUID,
      );
    });

    it("should be invalid id when it's 36 length but invalid characters", () => {
      expect(() => new UUID('8ab0b0f7-7324#5637-bc6b-109326f081c0')).toThrow(
        InvalidFormatError,
      );
    });
  });
});

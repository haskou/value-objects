import { InvalidFormatError } from '../../../src/errors/InvalidFormatError';
import { InvalidLengthError } from '../../../src/errors/InvalidLengthError';
import { LongId } from '../../../src/value-objects/ids/LongId';

describe('LongId', () => {
  describe('generate', () => {
    it('should generate a valid LongId', () => {
      const id = LongId.generate();
      expect(id).toBeInstanceOf(LongId);
      expect(id.toString()).toHaveLength(36);
    });
  });
  describe('constructor', () => {
    it('should throw invalid length error when constructor receives a empty string', () => {
      expect(() => new LongId('')).toThrow(InvalidLengthError);
    });

    it('should throw invalid format when value is not a valid id', () => {
      expect(() => new LongId('123')).toThrow(InvalidLengthError);
    });

    it("should be a valid id when it's 36 length string", () => {
      expect(
        () => new LongId('8ab0b0f7-7324-4637-bc6b-109326f081c0'),
      ).not.toThrow();
      expect(new LongId('8ab0b0f7-7324-4637-bc6b-109326f081c0')).toBeInstanceOf(
        LongId,
      );
    });

    it("should be invalid id when it's 36 length but invalid characters", () => {
      expect(() => new LongId('8ab0b0f7-7324#5637-bc6b-109326f081c0')).toThrow(
        InvalidFormatError,
      );
    });
  });
});

import { BaseError } from '../../src/errors/BaseError';

describe('BaseError', () => {
  describe('constructor', () => {
    it('should be valid instance', () => {
      const error = new BaseError('this is an error');
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should be valid when value is a string', () => {
      expect(new BaseError('this is an error').toString()).toInclude(
        'this is an error',
      );
    });
  });

  describe('isBaseError', () => {
    class TestBaseError extends BaseError {
      constructor() {
        super('test error');
      }
    }

    it('should be true when error is a BaseError', () => {
      const error = new BaseError('this is an error');
      expect(BaseError.isBaseError(error)).toBeTrue();
    });

    it('should be false when error is not a BaseError', () => {
      const error = new Error('this is an error');
      expect(BaseError.isBaseError(error)).toBeFalse();
    });

    it('should be false when error param is not an error', () => {
      expect(BaseError.isBaseError('')).toBeFalse();
    });

    it('should be true when error is a TestBaseError', () => {
      const error = new TestBaseError();
      expect(BaseError.isBaseError(error)).toBeTrue();
    });
  });

  describe('toString', () => {
    it('should return the error message', () => {
      const error = new BaseError('this is an error');
      expect(error.toString()).toInclude('this is an error');
    });
  });

  describe('getStack', () => {
    it('should return the error stack', () => {
      const error = new BaseError('this is an error');
      expect(error.getStack()).toInclude('this is an error');
    });

    it('should return empty stack', () => {
      const error = new BaseError('this is an error');
      delete error.stack;
      expect(error.getStack()).toBeEmpty();
    });
  });
});

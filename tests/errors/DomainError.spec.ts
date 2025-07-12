/* eslint-disable no-unused-expressions */
import { DomainError } from '../../src/errors/DomainError';

describe('DomainError', () => {
  describe('constructor', () => {
    it('should be valid instance', () => {
      const error = new DomainError('this is an error');
      expect(error).toBeInstanceOf(DomainError);
    });
  });

  describe('isDomainError', () => {
    class TestDomainError extends DomainError {
      constructor() {
        super('test error');
      }
    }

    it('should be true when error is a DomainError', () => {
      const error = new DomainError('this is an error');
      expect(DomainError.isDomainError(error)).toBeTrue();
    });

    it('should be false when error is not a DomainError', () => {
      const error = new Error('this is an error');
      expect(DomainError.isDomainError(error)).toBeFalse();
    });

    it('should be false when error param is not an error', () => {
      expect(DomainError.isDomainError('')).toBeFalse();
    });

    it('should be true when error is a TestDomainError', () => {
      const error = new TestDomainError();
      expect(DomainError.isDomainError(error)).toBeTrue();
    });
  });

  describe('toString', () => {
    it('should return the error message', () => {
      const error = new DomainError('this is an error');
      expect(error.toString()).toInclude('this is an error');
    });
  });

  describe('getStack', () => {
    it('should return the error stack', () => {
      const error = new DomainError('this is an error');
      expect(error.getStack()).toInclude('this is an error');
    });
  });
});

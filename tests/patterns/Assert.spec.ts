import { assert, DomainError } from '../../src';

describe('Assert', () => {
  it('should throw an error if the condition is false', () => {
    expect(() => {
      assert(false, 'Error');
    }).toThrow('Error');
  });

  it('should not throw an error if the condition is true', () => {
    expect(() => {
      assert(true, 'Error');
    }).not.toThrow();
  });

  it('should throw an error if the condition is false and the error is a function', () => {
    expect(() => {
      assert(false, new Error('Error'));
    }).toThrow('Error');
  });

  it('should throw a domain error if the condition is false and the error is a string', () => {
    expect(() => assert(false, 'Error')).toThrow(DomainError);
  });

  it('should throw if the condition is not a boolean', () => {
    expect(() => assert(1, 'Error')).not.toThrow();
  });
});

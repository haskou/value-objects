import { Integer, InvalidIntegerError, InvalidNumberError } from '../../src';

describe('Integer', () => {
  it('should create an Integer for a valid integer', () => {
    const value = 42;
    const integer = new Integer(value);

    expect(integer).toMatchObject({ value });
  });

  it('should throw InvalidIntegerError for a non-integer value', () => {
    const value = 42.5;

    expect(() => new Integer(value)).toThrow(InvalidIntegerError);
    expect(() => new Integer(value)).toThrow(`Invalid integer value ${value}`);
  });

  it('should throw InvalidNumberError for NaN', () => {
    const value = NaN;

    expect(() => new Integer(value)).toThrow(InvalidNumberError);
    expect(() => new Integer(value)).toThrow(`Invalid number ${value}`);
  });

  it('should throw InvalidIntegerError for Infinity', () => {
    const value = Infinity;

    expect(() => new Integer(value)).toThrow(InvalidIntegerError);
    expect(() => new Integer(value)).toThrow(`Invalid integer value ${value}`);
  });

  it('should throw InvalidIntegerError for -Infinity', () => {
    const value = -Infinity;

    expect(() => new Integer(value)).toThrow(InvalidIntegerError);
    expect(() => new Integer(value)).toThrow(`Invalid integer value ${value}`);
  });
});

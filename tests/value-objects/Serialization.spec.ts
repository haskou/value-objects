import {
  Coordinates,
  Email,
  NullObject,
  NullObjectError,
  NumberValueObject,
  StringValueObject,
  Timestamp,
} from '../../src';

describe('Serialization', () => {
  it('should serialize primitives in JSON.stringify', () => {
    const payload = {
      coordinates: new Coordinates(1, 2),
      email: new Email('a@b.co'),
      number: new NumberValueObject(3),
      timestamp: new Timestamp(1000),
    };

    expect(JSON.parse(JSON.stringify(payload))).toEqual({
      coordinates: '1,2',
      email: 'a@b.co',
      number: 3,
      timestamp: 1000,
    });
  });

  it('should return the primitive from toJSON', () => {
    expect(new StringValueObject('abc').toJSON()).toBe('abc');
    expect(new NumberValueObject(7).toJSON()).toBe(7);
  });

  it('should keep toString as the string representation', () => {
    expect(new NumberValueObject(7).toString()).toBe('7');
    expect(new Coordinates(1, 2).toString()).toBe('1,2');
  });

  it('should throw NullObjectError on a NullObject', () => {
    const nullObject = new StringValueObject(null as never);

    expect(NullObject.isNullObject(nullObject)).toBeTrue();
    expect(() => nullObject.toJSON()).toThrow(NullObjectError);
    expect(() => nullObject.toString()).toThrow(NullObjectError);
    expect(() => JSON.stringify({ nullObject })).toThrow(NullObjectError);
  });
});

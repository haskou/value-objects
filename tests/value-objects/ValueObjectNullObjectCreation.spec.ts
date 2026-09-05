import { NullObject, ValueObject } from '../../src';

class UserId extends ValueObject<string> {}

describe('ValueObject NullObject creation control', () => {
  it('keeps automatic NullObject creation enabled by default', () => {
    const value = new UserId(undefined as never);

    expect(NullObject.isNullObject(value)).toBe(true);
  });

  it('can disable automatic NullObject creation and restore it', () => {
    const disable = Reflect.get(ValueObject, 'disableNullObjectCreation');
    const enable = Reflect.get(ValueObject, 'enableNullObjectCreation');

    expect(typeof disable).toBe('function');
    expect(typeof enable).toBe('function');

    disable.call(ValueObject);

    try {
      expect(() => new UserId(undefined as never)).toThrow(
        'automatic NullObject creation is disabled',
      );
    } finally {
      enable.call(ValueObject);
    }

    expect(NullObject.isNullObject(new UserId(undefined as never))).toBe(true);
  });
});

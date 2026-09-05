import { PrimitiveOf, ValueObject } from '../../src';

class UntypedValue extends ValueObject {}

class CompositeSerializable {
  public toPrimitives() {
    return {
      child: { id: 'child-id' },
      tags: ['one', 'two'],
    };
  }
}

describe('Primitive contracts', () => {
  it('keeps composite serialization shapes available to PrimitiveOf', () => {
    const primitives: PrimitiveOf<CompositeSerializable> =
      new CompositeSerializable().toPrimitives();

    expect(primitives.tags).toEqual(['one', 'two']);
    expect(primitives.child.id).toBe('child-id');
  });

  it('keeps null-object valueOf typing visible for the default generic', () => {
    const value = new UntypedValue(undefined);

    // @ts-expect-error valueOf() may be nullish for a null object.
    value.valueOf().toString();
    expect(value.valueOf()).toBeUndefined();
  });
});

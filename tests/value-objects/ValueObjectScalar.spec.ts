import { ValueObject } from '../../src';

class StringId extends ValueObject<string> {}

describe('ValueObject scalar values', () => {
  it('supports scalar values', () => {
    expect(new StringId('id').valueOf()).toBe('id');
  });

  it('rejects structured values at compile time', () => {
    // @ts-expect-error ValueObject only accepts scalar values.
    class StructuredValue extends ValueObject<{ id: string }> {}

    expect(StructuredValue).toBeDefined();
  });
});

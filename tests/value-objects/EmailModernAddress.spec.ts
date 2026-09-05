import { Email } from '../../src';

describe('Email modern address validation', () => {
  it.each([
    "o'hara+tag@example.technology",
    'user@example.xn--p1ai',
  ])('accepts modern valid address %s', (value) => {
    expect(() => new Email(value)).not.toThrow();
  });
});

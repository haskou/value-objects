import { Email, InvalidEmailError } from '../../src';

describe('Email modern address validation', () => {
  it.each([
    "o'hara+tag@example.technology",
    'customer/department=shipping@example.com',
    'user@example.xn--p1ai',
    'user@example.XN--P1AI',
  ])('accepts modern valid address %s', (value) => {
    expect(() => new Email(value)).not.toThrow();
  });

  it('rejects malformed punycode TLDs ending in a hyphen', () => {
    expect(() => new Email('user@example.xn--abc-')).toThrow(
      InvalidEmailError,
    );
  });
});

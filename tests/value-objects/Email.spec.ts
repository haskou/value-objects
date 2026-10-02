import {
  Email,
  InvalidEmailError,
  InvalidStringLengthError,
  StringValueObject,
} from '../../src';
import { NullObject } from '../../src/value-objects/NullObject';

describe('Email', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(() => new Email(undefined as unknown as string)).not.toThrow();
      expect(
        NullObject.isNullObject(new Email(undefined as unknown as string)),
      ).toBeTrue();
    });

    const validEmails = [
      'user@example.com',
      'test.email@domain.org',
      'user+tag@example.co.uk',
      'first.last@subdomain.example.com',
      'user_name@example-domain.com',
      'test123@example.io',
      'admin@company.travel',
      'contact@site.museum',
      'info@domain.photography',
    ];

    it.each(validEmails)(
      'should create an Email instance for valid email addresses',
      (email) => {
        expect(() => new Email(email)).not.toThrow();
        expect(new Email(email).toString()).toBe(email);
      },
    );

    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user.domain.com',
      'user@domain.',
      'user@.com',
      'user@@domain.com',
      'user@domain..com',
      'user name@domain.com',
      'user@domain.c',
      `user@domain.${'a'.repeat(64)}`,
      '',
    ];

    it.each(invalidEmails)(
      'should throw InvalidEmailError for invalid email addresses',
      (email) => {
        expect(() => new Email(email)).toThrow(InvalidEmailError);
      },
    );

    it('should accept another StringValueObject', () => {
      const emailString = new StringValueObject('user@example.com');
      const email = new Email(emailString);
      expect(email.toString()).toBe('user@example.com');
    });

    it('should validate email format when constructed from StringValueObject', () => {
      const invalidEmailString = new StringValueObject('invalid-email');
      expect(() => new Email(invalidEmailString)).toThrow(InvalidEmailError);
    });
  });

  describe('inheritance and StringValueObject behavior', () => {
    it('should inherit from StringValueObject', () => {
      const email = new Email('test@example.com');
      expect(email).toBeInstanceOf(Email);
      expect(email).toBeInstanceOf(StringValueObject);
      expect(email.valueOf).toBeDefined();
      expect(email.isEqual).toBeDefined();
      expect(email.toString).toBeDefined();
      expect(email.isEmpty).toBeDefined();
    });

    it('should implement valueOf() method correctly from StringValueObject', () => {
      const emailValue = 'admin@company.org';
      const email = new Email(emailValue);
      expect(email.valueOf()).toBe(emailValue);
    });

    it('should implement toString() method correctly from StringValueObject', () => {
      const emailValue = 'contact@website.net';
      const email = new Email(emailValue);
      expect(email.toString()).toBe(emailValue);
    });

    it('should implement isEmpty() method correctly from StringValueObject', () => {
      // Email cannot be empty due to validation, but method should exist
      const email = new Email('user@domain.com');
      expect(email.isEmpty()).toBeFalse();
      expect(typeof email.isEmpty).toBe('function');
    });

    it('should implement isEqual() method correctly', () => {
      const emailValue = 'test@example.com';
      const email1 = new Email(emailValue);
      const email2 = new Email(emailValue);
      const email3 = new Email('different@example.com');

      expect(email1.isEqual(email2)).toBeTrue();
      expect(email1.isEqual(email3)).toBeFalse();
      expect(email1.hasValue(emailValue)).toBeTrue();
      expect(email1.hasValue('different@example.com')).toBeFalse();
    });

    it('should compare with string values using hasValue', () => {
      const email = new Email('hello@world.com');
      expect(email.hasValue('hello@world.com')).toBeTrue();
      expect(email.hasValue('goodbye@world.com')).toBeFalse();
    });

    it('should implement clone() method correctly inherited from ValueObject', () => {
      const originalValue = 'clone@test.com';
      const original = new Email(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(Email);
      expect(cloned).toBeInstanceOf(StringValueObject);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should maintain email validation in cloned instances', () => {
      const original = new Email('valid@example.com');
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(Email);
      expect(cloned.valueOf()).toBe('valid@example.com');

      // Cloned instance should still be a valid email
      expect(() => cloned.toString()).not.toThrow();
      expect(cloned.toString()).toBe('valid@example.com');
    });
  });
});

describe('Email limits and domain', () => {
  it('should accept an address of exactly 254 characters', () => {
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`;

    expect(email.length).toBe(254);
    expect(() => new Email(email)).not.toThrow();
  });

  it('should reject addresses longer than 254 characters', () => {
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(63)}.com`;

    expect(email.length).toBeGreaterThan(254);
    expect(() => new Email(email)).toThrow(InvalidStringLengthError);
  });

  it('should reject local parts longer than 64 characters', () => {
    expect(() => new Email(`${'a'.repeat(65)}@example.com`)).toThrow(
      InvalidEmailError,
    );
  });

  it('should reject underscores in the domain', () => {
    expect(() => new Email('user@my_domain.com')).toThrow(InvalidEmailError);
    expect(() => new Email('user@sub_domain.example.com')).toThrow(
      InvalidEmailError,
    );
  });

  it('should reject domain labels longer than 63 characters', () => {
    expect(() => new Email(`user@${'a'.repeat(64)}.com`)).toThrow(
      InvalidEmailError,
    );
  });

  it('should reject domain labels starting or ending with a hyphen', () => {
    expect(() => new Email('user@-example.com')).toThrow(InvalidEmailError);
    expect(() => new Email('user@example-.com')).toThrow(InvalidEmailError);
  });
});

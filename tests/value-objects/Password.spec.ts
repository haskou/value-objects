import { Password, InvalidPasswordError, NullObject } from '../../src';

describe('Password', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when receiving nullish', () => {
      expect(() => new Password(undefined as unknown as string)).not.toThrow();
      expect(
        NullObject.isNullObject(new Password(undefined as unknown as string)),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new Password(null as unknown as string)),
      ).toBeTrue();
    });

    it('should create a valid password with the required complexity', () => {
      const validPassword = 'Valid-password1!';

      const password = new Password(validPassword);

      expect(password.valueOf()).toBe(validPassword);
    });

    it('should create a valid password with exactly 12 characters', () => {
      const exactPassword = 'Valid-pass1!';

      const password = new Password(exactPassword);

      expect(password.valueOf()).toBe(exactPassword);
    });

    it('should throw InvalidPasswordError when password is shorter than 12 characters', () => {
      const shortPassword = 'Short-1';

      expect(() => new Password(shortPassword)).toThrow(InvalidPasswordError);
    });

    it('should throw InvalidPasswordError when password is longer than 256 characters', () => {
      const longPassword = `A${'a'.repeat(254)}1!`;

      expect(() => new Password(longPassword)).toThrow(InvalidPasswordError);
    });

    it('should throw InvalidPasswordError when password has no uppercase letters', () => {
      expect(() => new Password('valid-password1!')).toThrow(
        InvalidPasswordError,
      );
    });

    it('should throw InvalidPasswordError when password has no lowercase letters', () => {
      expect(() => new Password('VALID-PASSWORD1!')).toThrow(
        InvalidPasswordError,
      );
    });

    it('should throw InvalidPasswordError when password has no numbers', () => {
      expect(() => new Password('Valid-password!')).toThrow(
        InvalidPasswordError,
      );
    });

    it('should throw InvalidPasswordError when password has no symbols', () => {
      expect(() => new Password('Validpassword1')).toThrow(
        InvalidPasswordError,
      );
    });

    it('should throw InvalidPasswordError when password is empty', () => {
      expect(() => new Password('')).toThrow(InvalidPasswordError);
    });
  });
});

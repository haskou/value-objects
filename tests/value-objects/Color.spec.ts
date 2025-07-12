import {
  Color,
  InvalidColorError,
  NullObject,
  StringValueObject,
} from '../../src';

describe('Color', () => {
  describe('constructor', () => {
    it('should return a NullValueObject when a Nullish is received', () => {
      expect(() => new Color(undefined as unknown as string)).not.toThrow();
      expect(
        NullObject.isNullObject(new Color(undefined as unknown as string)),
      ).toBeTrue();
      expect(
        NullObject.isNullObject(new Color(null as unknown as string)),
      ).toBeTrue();
    });

    const validColors = [
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFFFF',
      '#000000',
      '#FFA500',
      '#000',
      '#FFF',
    ];
    it.each(validColors)(
      'should create a Color instance for valid hex color codes',
      (color) => {
        expect(() => new Color(color)).not.toThrow();
      },
    );

    const invalidColors = [
      '#GGGGGG',
      '123456',
      '#12345',
      '#1234567',
      'red',
      '123',
      '#HHH',
      '',
    ];
    it.each(invalidColors)(
      'should create a Color instance for valid hex color codes',
      (color) => {
        expect(() => new Color(color)).toThrow(InvalidColorError);
      },
    );
  });

  describe('predefined static colors', () => {
    it('should have correct values for predefined colors', () => {
      expect(Color.RED).toMatchObject({ value: '#FF0000' });
      expect(Color.GREEN).toMatchObject({ value: '#00FF00' });
      expect(Color.BLUE).toMatchObject({ value: '#0000FF' });
      expect(Color.BLACK).toMatchObject({ value: '#000000' });
      expect(Color.WHITE).toMatchObject({ value: '#FFFFFF' });
      expect(Color.YELLOW).toMatchObject({ value: '#FFFF00' });
      expect(Color.CYAN).toMatchObject({ value: '#00FFFF' });
      expect(Color.MAGENTA).toMatchObject({ value: '#FF00FF' });
      expect(Color.ORANGE).toMatchObject({ value: '#FFA500' });
      expect(Color.PURPLE).toMatchObject({ value: '#800080' });
      expect(Color.PINK).toMatchObject({ value: '#FFC0CB' });
      expect(Color.BROWN).toMatchObject({ value: '#A52A2A' });
    });
  });

  describe('equality', () => {
    it('should return true for two Color instances with the same value', () => {
      const color1 = new Color('#FF0000');
      const color2 = new Color('#FF0000');
      expect(color1.isEqual(color2)).toBe(true);
    });

    it('should return false for two Color instances with different values', () => {
      const color1 = new Color('#FF0000');
      const color2 = new Color('#00FF00');
      expect(color1.isEqual(color2)).toBe(false);
    });

    it('should return true for two Color instances with the same value regardless of case', () => {
      const color1 = new Color('#FF0000');
      const color2 = new Color('#ff0000');
      expect(color1.isEqual(color2)).toBe(true);
    });

    it('should return false when comparing a Color instance with null', () => {
      const color1 = new Color('#FF0000');
      expect(color1.isEqual(null as unknown as Color)).toBe(false);
    });

    it('should return false when comparing a Color instance with undefined', () => {
      const color1 = new Color('#FF0000');
      expect(color1.isEqual(undefined as unknown as Color)).toBe(false);
    });
  });

  describe('inherited methods from StringValueObject', () => {
    it('should return the correct string value using toString()', () => {
      const color = new Color('#ABCDEF');
      expect(color.toString()).toBe('#ABCDEF');
    });

    it('should return the correct primitive value using valueOf()', () => {
      const color = new Color('#123456');
      expect(color.valueOf()).toBe('#123456');
    });

    it('should be instance of StringValueObject', () => {
      const color = new Color('#FFFFFF');
      expect(color instanceof StringValueObject).toBe(true);
    });

    it('should be instance of Color', () => {
      const color = new Color('#000000');
      expect(color instanceof Color).toBe(true);
    });

    it('should compare equality using inherited equals() method', () => {
      const color1 = new Color('#ABCDEF');
      const color2 = new Color('#ABCDEF');
      expect(color1.isEqual(color2)).toBe(true);
    });

    it('should compare inequality using inherited equals() method', () => {
      const color1 = new Color('#ABCDEF');
      const color2 = new Color('#123456');
      expect(color1.isEqual(color2)).toBe(false);
    });
  });

  describe('inheritance and StringValueObject behavior', () => {
    it('should implement valueOf() method correctly from StringValueObject', () => {
      const value = '#ABCDEF';
      const color = new Color(value);
      expect(color.valueOf()).toBe(value);
    });

    it('should implement toString() method correctly from StringValueObject', () => {
      const value = '#123456';
      const color = new Color(value);
      expect(color.toString()).toBe(value);
    });

    it('should implement isEmpty() method correctly from StringValueObject', () => {
      // Color cannot be empty due to validation, but method should exist
      const color = new Color('#FFF');
      expect(color.isEmpty()).toBeFalse();
      expect(typeof color.isEmpty).toBe('function');
    });

    it('should override isEqual() method with case-insensitive comparison', () => {
      const color1 = new Color('#FF0000');
      const color2 = new Color('#ff0000');
      const color3 = new Color('#00FF00');

      expect(color1.isEqual(color2)).toBeTrue();
      expect(color1.isEqual(color3)).toBeFalse();
    });

    it('should accept StringValueObject in constructor', () => {
      const stringValueObject = new StringValueObject('#FFFFFF');
      const color = new Color(stringValueObject);
      expect(color.toString()).toBe('#FFFFFF');
      expect(color.valueOf()).toBe('#FFFFFF');
    });

    it('should validate color format when constructed from StringValueObject', () => {
      const invalidStringValueObject = new StringValueObject('invalid-color');
      expect(() => new Color(invalidStringValueObject)).toThrow(
        InvalidColorError,
      );
    });

    it('should implement clone() method correctly inherited from ValueObject', () => {
      const originalValue = '#ABCDEF';
      const original = new Color(originalValue);
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(Color);
      expect(cloned).toBeInstanceOf(StringValueObject);
      expect(cloned.valueOf()).toBe(originalValue);
      expect(cloned.toString()).toBe(originalValue);
      expect(cloned.isEqual(original)).toBeTrue();
      expect(cloned).not.toBe(original); // Different instances
    });

    it('should clone static predefined colors correctly', () => {
      const originalRed = Color.RED;
      const clonedRed = (originalRed as any).clone();

      expect(clonedRed).toBeInstanceOf(Color);
      expect(clonedRed.valueOf()).toBe('#FF0000');
      expect(clonedRed.isEqual(originalRed)).toBeTrue();
      expect(clonedRed).not.toBe(originalRed);
    });

    it('should maintain color validation in cloned instances', () => {
      const original = new Color('#123ABC');
      const cloned = (original as any).clone();

      expect(cloned).toBeInstanceOf(Color);
      expect(cloned.valueOf()).toBe('#123ABC');

      // Cloned instance should still be a valid color
      expect(() => cloned.toString()).not.toThrow();
      expect(cloned.toString()).toBe('#123ABC');
    });
  });
});

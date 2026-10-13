import {
  FileSize,
  FileSizeUnit,
  InvalidFormatError,
  InvalidIntegerError,
  InvalidPositiveNumberError,
  NullObject,
  PositiveInteger,
  ValueNotInEnumError,
} from '../../src';

describe('FileSize', () => {
  it('should be created from bytes', () => {
    expect(new FileSize(1024).valueOf()).toBe(1024);
    expect(FileSize.fromBytes(0).valueOf()).toBe(0);
  });

  it('should reject negative and fractional bytes', () => {
    expect(() => new FileSize(-1)).toThrow(InvalidPositiveNumberError);
    expect(() => new FileSize(0.5)).toThrow(InvalidIntegerError);
  });

  it('should convert from SI and IEC units', () => {
    expect(FileSize.from(1.5, FileSizeUnit.KILOBYTE).valueOf()).toBe(1500);
    expect(FileSize.from(1.5, FileSizeUnit.KIBIBYTE).valueOf()).toBe(1536);
    expect(FileSize.from(2, FileSizeUnit.GIBIBYTE).valueOf()).toBe(2 ** 31);
  });

  it('should round to the nearest byte when converting from a unit', () => {
    expect(FileSize.from(0.4, FileSizeUnit.BYTE).valueOf()).toBe(0);
    expect(FileSize.from(0.6, FileSizeUnit.BYTE).valueOf()).toBe(1);
  });

  it('should convert to a unit without rounding', () => {
    expect(new FileSize(1536).to(FileSizeUnit.KIBIBYTE).valueOf()).toBe(1.5);
    expect(new FileSize(1500).to(FileSizeUnit.KILOBYTE).valueOf()).toBe(1.5);
  });

  describe('parse', () => {
    it('should parse value and unit with or without space', () => {
      expect(FileSize.parse('1.5 MiB').valueOf()).toBe(1572864);
      expect(FileSize.parse('2MB').valueOf()).toBe(2_000_000);
      expect(FileSize.parse('  10 B ').valueOf()).toBe(10);
    });

    it('should throw InvalidFormatError for malformed text', () => {
      expect(() => FileSize.parse('MiB')).toThrow(InvalidFormatError);
      expect(() => FileSize.parse('-1 MB')).toThrow(InvalidFormatError);
      expect(() => FileSize.parse('')).toThrow(InvalidFormatError);
    });

    it('should throw ValueNotInEnumError for an unknown unit', () => {
      expect(() => FileSize.parse('1 XB')).toThrow(ValueNotInEnumError);
      expect(() => FileSize.parse('1 KB')).toThrow(ValueNotInEnumError);
    });
  });

  describe('arithmetic', () => {
    it('should add and subtract returning FileSize', () => {
      const sum = new FileSize(1000).add(new FileSize(24));
      const diff = new FileSize(1000).subtract(new FileSize(400));

      expect(sum).toBeInstanceOf(FileSize);
      expect(sum.valueOf()).toBe(1024);
      expect(diff).toBeInstanceOf(FileSize);
      expect(diff.valueOf()).toBe(600);
    });

    it('should throw when subtracting below zero', () => {
      expect(() => new FileSize(1).subtract(new FileSize(2))).toThrow(
        InvalidPositiveNumberError,
      );
    });
  });

  describe('toHumanReadable', () => {
    it('should pick the largest fitting IEC unit', () => {
      const result = new FileSize(1536).toHumanReadable(FileSizeUnit.IEC);

      expect(result.unit.isEqual(FileSizeUnit.KIBIBYTE)).toBe(true);
      expect(result.value.valueOf()).toBe(1.5);
    });

    it('should pick the largest fitting SI unit', () => {
      const result = new FileSize(2_500_000).toHumanReadable(FileSizeUnit.SI);

      expect(result.unit.isEqual(FileSizeUnit.MEGABYTE)).toBe(true);
      expect(result.value.valueOf()).toBe(2.5);
    });

    it('should use the unit exactly at its boundary', () => {
      const result = new FileSize(1024).toHumanReadable(FileSizeUnit.IEC);

      expect(result.unit.isEqual(FileSizeUnit.KIBIBYTE)).toBe(true);
      expect(result.value.valueOf()).toBe(1);
    });

    it('should fall back to the smallest unit below it', () => {
      const result = new FileSize(1023).toHumanReadable(FileSizeUnit.IEC);

      expect(result.unit.isEqual(FileSizeUnit.BYTE)).toBe(true);
      expect(result.value.valueOf()).toBe(1023);
      expect(
        new FileSize(0)
          .toHumanReadable(FileSizeUnit.SI)
          .unit.isEqual(FileSizeUnit.BYTE),
      ).toBe(true);
    });

    it('should not depend on the order of the given units', () => {
      const result = new FileSize(5_000_000).toHumanReadable([
        FileSizeUnit.MEGABYTE,
        FileSizeUnit.BYTE,
        FileSizeUnit.KILOBYTE,
      ]);

      expect(result.unit.isEqual(FileSizeUnit.MEGABYTE)).toBe(true);
    });
  });

  it('should return a NullObject when a Nullish is received', () => {
    expect(
      NullObject.isNullObject(new FileSize(null as unknown as number)),
    ).toBe(true);
    expect(
      NullObject.isNullObject(new FileSize(undefined as unknown as number)),
    ).toBe(true);
  });

  it('should be equal only to a FileSize with the same bytes', () => {
    expect(
      FileSize.from(1, FileSizeUnit.KIBIBYTE).isEqual(new FileSize(1024)),
    ).toBe(true);
    expect(new FileSize(1024).isEqual(new PositiveInteger(1024))).toBe(false);
  });

  it('should not mutate when operating', () => {
    const original = new FileSize(100);

    original.add(new FileSize(1));

    expect(original.valueOf()).toBe(100);
  });

  it('should expose its bytes as a PositiveInteger', () => {
    const bytes = new FileSize(42).toBytes();

    expect(bytes).toBeInstanceOf(PositiveInteger);
    expect(bytes.valueOf()).toBe(42);
  });

  it('should convert every unit back to the same byte count', () => {
    const unit = FileSizeUnit.PEBIBYTE;
    const size = FileSize.from(1, unit);

    expect(size.valueOf()).toBe(2 ** 50);
    expect(size.to(unit).valueOf()).toBe(1);
  });
});

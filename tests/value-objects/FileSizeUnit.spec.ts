import {
  Enum,
  FileSizeUnit,
  NullObject,
  PositiveInteger,
  ValueNotInEnumError,
} from '../../src';

describe('FileSizeUnit', () => {
  it('should be an Enum', () => {
    expect(FileSizeUnit.BYTE).toBeInstanceOf(Enum);
  });

  it('should reject symbols outside the enum', () => {
    expect(() => new FileSizeUnit('bits')).toThrow(ValueNotInEnumError);
    expect(() => new FileSizeUnit('KB')).toThrow(ValueNotInEnumError);
    expect(() => new FileSizeUnit('mib')).toThrow(ValueNotInEnumError);
  });

  it('should return a NullObject when a Nullish is received', () => {
    expect(
      NullObject.isNullObject(new FileSizeUnit(null as unknown as string)),
    ).toBeTrue();
  });

  it('should be equal when built from the same symbol', () => {
    expect(new FileSizeUnit('MiB').isEqual(FileSizeUnit.MEBIBYTE)).toBeTrue();
    expect(FileSizeUnit.MEGABYTE.isEqual(FileSizeUnit.MEBIBYTE)).toBeFalse();
  });

  describe('getBytes', () => {
    it.each([
      [FileSizeUnit.BYTE, 1],
      [FileSizeUnit.KILOBYTE, 1000],
      [FileSizeUnit.MEGABYTE, 1000 ** 2],
      [FileSizeUnit.GIGABYTE, 1000 ** 3],
      [FileSizeUnit.TERABYTE, 1000 ** 4],
      [FileSizeUnit.PETABYTE, 1000 ** 5],
      [FileSizeUnit.KIBIBYTE, 1024],
      [FileSizeUnit.MEBIBYTE, 1024 ** 2],
      [FileSizeUnit.GIBIBYTE, 1024 ** 3],
      [FileSizeUnit.TEBIBYTE, 1024 ** 4],
      [FileSizeUnit.PEBIBYTE, 1024 ** 5],
    ])('should return the bytes of %s', (unit, bytes) => {
      const result = unit.getBytes();

      expect(result).toBeInstanceOf(PositiveInteger);
      expect(result.valueOf()).toBe(bytes);
    });
  });

  describe('unit sets', () => {
    it('should list SI units from smallest to largest', () => {
      expect(FileSizeUnit.SI.map((unit) => unit.valueOf())).toEqual([
        'B',
        'kB',
        'MB',
        'GB',
        'TB',
        'PB',
      ]);
    });

    it('should list IEC units from smallest to largest', () => {
      expect(FileSizeUnit.IEC.map((unit) => unit.valueOf())).toEqual([
        'B',
        'KiB',
        'MiB',
        'GiB',
        'TiB',
        'PiB',
      ]);
    });

    it('should cover every enum value across both sets', () => {
      const symbols = new Set(
        [...FileSizeUnit.SI, ...FileSizeUnit.IEC].map((unit) => unit.valueOf()),
      );

      expect([...symbols].sort()).toEqual(
        [...FileSizeUnit.BYTE.getValues()].sort(),
      );
    });
  });
});

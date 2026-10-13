import { Enum } from '../Enum';
import { PositiveInteger } from '../PositiveInteger';

export enum EFileSizeUnit {
  BYTE = 'B',
  KILOBYTE = 'kB',
  MEGABYTE = 'MB',
  GIGABYTE = 'GB',
  TERABYTE = 'TB',
  PETABYTE = 'PB',
  KIBIBYTE = 'KiB',
  MEBIBYTE = 'MiB',
  GIBIBYTE = 'GiB',
  TEBIBYTE = 'TiB',
  PEBIBYTE = 'PiB',
}

const SI_BASE = 1000;
const IEC_BASE = 1024;

export const fileSizeUnitToBytesMap: Record<EFileSizeUnit, number> = {
  [EFileSizeUnit.BYTE]: 1,
  [EFileSizeUnit.GIBIBYTE]: IEC_BASE ** 3,
  [EFileSizeUnit.GIGABYTE]: SI_BASE ** 3,
  [EFileSizeUnit.KIBIBYTE]: IEC_BASE ** 1,
  [EFileSizeUnit.KILOBYTE]: SI_BASE ** 1,
  [EFileSizeUnit.MEBIBYTE]: IEC_BASE ** 2,
  [EFileSizeUnit.MEGABYTE]: SI_BASE ** 2,
  [EFileSizeUnit.PEBIBYTE]: IEC_BASE ** 5,
  [EFileSizeUnit.PETABYTE]: SI_BASE ** 5,
  [EFileSizeUnit.TEBIBYTE]: IEC_BASE ** 4,
  [EFileSizeUnit.TERABYTE]: SI_BASE ** 4,
};

export type FileSizeUnits = readonly [FileSizeUnit, ...FileSizeUnit[]];

export class FileSizeUnit extends Enum<string> {
  public static readonly BYTE = new FileSizeUnit(EFileSizeUnit.BYTE);
  public static readonly KILOBYTE = new FileSizeUnit(EFileSizeUnit.KILOBYTE);
  public static readonly MEGABYTE = new FileSizeUnit(EFileSizeUnit.MEGABYTE);
  public static readonly GIGABYTE = new FileSizeUnit(EFileSizeUnit.GIGABYTE);
  public static readonly TERABYTE = new FileSizeUnit(EFileSizeUnit.TERABYTE);
  public static readonly PETABYTE = new FileSizeUnit(EFileSizeUnit.PETABYTE);
  public static readonly KIBIBYTE = new FileSizeUnit(EFileSizeUnit.KIBIBYTE);
  public static readonly MEBIBYTE = new FileSizeUnit(EFileSizeUnit.MEBIBYTE);
  public static readonly GIBIBYTE = new FileSizeUnit(EFileSizeUnit.GIBIBYTE);
  public static readonly TEBIBYTE = new FileSizeUnit(EFileSizeUnit.TEBIBYTE);
  public static readonly PEBIBYTE = new FileSizeUnit(EFileSizeUnit.PEBIBYTE);

  public static readonly SI: FileSizeUnits = [
    FileSizeUnit.BYTE,
    FileSizeUnit.KILOBYTE,
    FileSizeUnit.MEGABYTE,
    FileSizeUnit.GIGABYTE,
    FileSizeUnit.TERABYTE,
    FileSizeUnit.PETABYTE,
  ];

  public static readonly IEC: FileSizeUnits = [
    FileSizeUnit.BYTE,
    FileSizeUnit.KIBIBYTE,
    FileSizeUnit.MEBIBYTE,
    FileSizeUnit.GIBIBYTE,
    FileSizeUnit.TEBIBYTE,
    FileSizeUnit.PEBIBYTE,
  ];

  public getValues(): string[] {
    return Object.values(EFileSizeUnit);
  }

  public getBytes(): PositiveInteger {
    return new PositiveInteger(
      fileSizeUnitToBytesMap[this.value as EFileSizeUnit],
    );
  }
}

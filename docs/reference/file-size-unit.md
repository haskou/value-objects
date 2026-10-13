---
title: FileSizeUnit
description: Enum value object for file size units, SI and IEC.
---

# `FileSizeUnit`

Enum value object for file size units, SI and IEC.

## Import

```typescript
import { FileSizeUnit } from '@haskou/value-objects';
```

## Signature

```typescript
class FileSizeUnit extends Enum<string>
```

## Constructor

```typescript
constructor(value: string)
```

## Values

| Standard | Base | Units |
| --- | --- | --- |
| Bytes | 1 | `BYTE` (`B`) |
| SI | 1000 | `KILOBYTE` (`kB`), `MEGABYTE` (`MB`), `GIGABYTE` (`GB`), `TERABYTE` (`TB`), `PETABYTE` (`PB`) |
| IEC | 1024 | `KIBIBYTE` (`KiB`), `MEBIBYTE` (`MiB`), `GIBIBYTE` (`GiB`), `TEBIBYTE` (`TiB`), `PEBIBYTE` (`PiB`) |

## Members

| Member | Description |
| --- | --- |
| `static SI` | Bytes plus the SI units, from smallest to largest. |
| `static IEC` | Bytes plus the IEC units, from smallest to largest. |
| `getBytes()` | Returns the bytes in one unit as `PositiveInteger`. |
| `getValues()` | Returns the accepted symbols. |

## Throws

- `ValueNotInEnumError` when the symbol is not one of the values above. Symbols are case-sensitive.

## Example

```typescript
import { FileSizeUnit } from '@haskou/value-objects';

FileSizeUnit.MEBIBYTE.getBytes().valueOf(); // 1048576
new FileSizeUnit('MB').isEqual(FileSizeUnit.MEGABYTE); // true
new FileSizeUnit('KB'); // throws ValueNotInEnumError
```

## Related

- [`FileSize`](/reference/file-size)
- [`Enum`](/reference/enum)
- [Reference overview](/reference/)

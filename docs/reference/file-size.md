---
title: FileSize
description: File size value object stored in bytes.
---

# `FileSize`

File size value object stored in bytes.

## Import

```typescript
import { FileSize, FileSizeUnit } from '@haskou/value-objects';
```

## Signature

```typescript
class FileSize extends PositiveInteger
```

## Constructor

```typescript
constructor(bytes: number | NumberValueObject)
```

## Validation

Accepts integers greater than or equal to `0`.

## Methods

| Method | Description |
| --- | --- |
| `static fromBytes(bytes)` | Creates a size from bytes. |
| `static from(value, unit)` | Creates a size from a value in a `FileSizeUnit`, rounded to the nearest byte. |
| `static parse(text)` | Parses text such as `1.5 MiB` or `2MB`. |
| `toBytes()` | Returns the bytes as `PositiveInteger`. |
| `to(unit)` | Returns the size in `unit` as `NumberValueObject`, without rounding. |
| `toHumanReadable(units)` | Returns `{ value, unit }` using the largest unit of `units` that fits. |
| `add(other)` | Returns the sum as `FileSize`. |
| `subtract(other)` | Returns the difference as `FileSize`. |

Comparison and the rest of the arithmetic are inherited from `NumberValueObject`.

## Throws

This class can throw:

- `InvalidPositiveNumberError`
- `InvalidIntegerError`
- `InvalidNumberError`
- `InvalidFormatError` from `parse` when the text is not `<number> <unit>`
- `ValueNotInEnumError` from `parse` when the unit is unknown

## Example

```typescript
import { FileSize, FileSizeUnit } from '@haskou/value-objects';

const size = FileSize.from(1.5, FileSizeUnit.MEBIBYTE);

size.valueOf(); // 1572864
size.to(FileSizeUnit.KIBIBYTE).valueOf(); // 1536

const { value, unit } = size.toHumanReadable(FileSizeUnit.IEC);
`${value} ${unit}`; // '1.5 MiB'

FileSize.parse('2 MB').valueOf(); // 2000000
```

## Notes

- `toHumanReadable` does not format or round. Format `value` where you present it, for example with `Intl.NumberFormat`.
- SI units use base 1000 (`kB`, `MB`) and IEC units use base 1024 (`KiB`, `MiB`). `KB` is not a valid unit.
- `multiply` and `divide` do not round: a non-integer result throws `InvalidIntegerError`.
- Factories use the calling class, so subclasses get their own type back.

## Related

- [`FileSizeUnit`](/reference/file-size-unit)
- [`PositiveInteger`](/reference/positive-integer)
- [Reference overview](/reference/)

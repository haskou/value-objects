---
title: Month
description: Month enum value object.
---

# `Month`

Month enum value object.

## Import

```typescript
import { Month } from '@haskou/value-objects';
```

## Signature

```typescript
class Month extends Enum<number>
```

## Constructor

```typescript
constructor(value: number)
```

## Validation

Must be an integer value from `1` to `12`.

## Throws

This class can throw:

- `ValueNotInEnumError`

## Methods

| Method | Description |
| --- | --- |
| `getValues()` | Returns `[1, 2, ..., 12]`. |
| `getIndex()` | Returns zero-based month index for `Date` APIs. |

## Example

```typescript
import { Month } from '@haskou/value-objects';

Month.JANUARY.valueOf(); // 1
Month.JANUARY.getIndex(); // 0
new Month(12).valueOf(); // 12
```

## Notes

- Static constants are provided for every month.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

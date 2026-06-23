---
title: Year
description: Year value object with leap-year helpers.
---

# `Year`

Integer year value object with leap-year helpers.

## Import

```typescript
import { Year } from '@haskou/value-objects';
```

## Signature

```typescript
class Year extends Integer
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

Uses `Integer` validation. The current implementation accepts negative years and zero because no calendar range is enforced.

## Methods

| Method | Description |
| --- | --- |
| `isLeapYear()` | Returns true when `getNumberOfDays()` is 366. |
| `getNumberOfDays()` | Returns 365 or 366 using Gregorian leap-year rules. |

## Example

```typescript
import { Year } from '@haskou/value-objects';

const year = new Year(2024);

year.isLeapYear(); // true
year.getNumberOfDays(); // 366
```

## Notes

- Years divisible by 4 are leap years unless divisible by 100, except years divisible by 400.
- `Year` inherits number comparison helpers from `Integer` and `NumberValueObject`.

---
title: DayOfWeek
description: Enum value object for weekdays.
---

# `DayOfWeek`

Enum value object for weekdays.

## Import

```typescript
import { DayOfWeek } from '@haskou/value-objects';
```

## Signature

```typescript
class DayOfWeek extends Enum
```

## Constructor

```typescript
constructor(value: EDaysOfWeek | string)
```

## Validation

Must be one of `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`.

## Throws

This class can throw:

- `ValueNotInEnumError`
- `InvalidDayError`

## Methods

| Method | Description |
| --- | --- |
| `static fromNumber(day)` | Maps `Date#getUTCDay()` numbers to a `DayOfWeek`. |
| `static fromTimestamp(timestamp)` | Builds from a `Timestamp`. |
| `getValues()` | Returns all valid weekday strings. |
| `toNumber()` | Returns the JavaScript UTC weekday number. |

## Example

```typescript
import { DayOfWeek } from '@haskou/value-objects';

DayOfWeek.MONDAY.toString(); // 'monday'
DayOfWeek.SUNDAY.toNumber(); // 0
DayOfWeek.fromNumber(2).toString(); // 'tuesday'
```

## Notes

- Static constants are provided for every weekday.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

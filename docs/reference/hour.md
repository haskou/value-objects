---
title: Hour
description: 24-hour HH:MM value object.
---

# `Hour`

24-hour HH:MM value object.

## Import

```typescript
import { Hour } from '@haskou/value-objects';
```

## Signature

```typescript
class Hour extends StringValueObject
```

## Constructor

```typescript
constructor(value: string) | constructor(value: number, minutes?: number)
```

## Validation

Hours must be 0 to 23. Minutes must be 0 to 59. String input must contain exactly two colon-separated numeric parts.

## Throws

This class can throw:

- `InvalidHourError`
- `InvalidMinutesError`

## Methods

| Method | Description |
| --- | --- |
| `addMinutes(minutes)` | Returns a new `Hour`, wrapping around the day. |
| `diffInMinutes(other)` | Returns forward distance in minutes, wrapping to the next day when needed. |
| `getHours()` | Returns numeric hours. |
| `getMinutes()` | Returns numeric minutes. |
| `isGreaterThan(hour)` | Compares by time-of-day. |
| `isLessThan(hour)` | Compares by time-of-day. |

## Example

```typescript
import { Hour } from '@haskou/value-objects';

const start = new Hour('09:30');
const end = start.addMinutes(90);

end.toString(); // '11:00'
start.diffInMinutes(new Hour('10:00')); // 30
new Hour('23:30').addMinutes(60).toString(); // '00:30'
```

## Notes

- String output is always zero-padded as `HH:MM`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

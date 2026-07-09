---
title: TimestampInterval
description: Start/end timestamp interval value object.
---

# `TimestampInterval`

Start/end timestamp interval value object.

## Import

```typescript
import { TimestampInterval } from '@haskou/value-objects';
```

## Signature

```typescript
class TimestampInterval extends ValueObject<string>
```

## Constructor

```typescript
constructor(start: Timestamp, end: Timestamp)
```

## Validation

`start` must be before or equal to `end` in the constructor. Intervals are immutable; create a new interval when either boundary changes.

## Throws

This class can throw:

- `InvalidTimestampIntervalError`

## Methods

| Method                                   | Description                                                        |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `static fromPrimitives(primitives)`      | Restores from `{ start, end }` milliseconds.                       |
| `toPrimitives()`                         | Returns `{ start, end }`.                                          |
| `getStart()`                             | Returns the current start timestamp.                               |
| `getEnd()`                               | Returns the current end timestamp.                                 |
| `getDuration()`                          | Returns a `Duration`.                                              |
| `getTotalDaysOfWeek(dayOfWeek)`          | Counts occurrences of a weekday within the interval.               |
| `getDaysBetweenInterval()`               | Returns all `CalendarDay` values between start and end, inclusive. |
| `getOverlappingInterval(searchInterval)` | Returns overlapping interval or `null`.                            |
| `includes(timestamp)`                    | Checks whether a timestamp is inside the interval, inclusive.      |

## Example

```typescript
import { Timestamp, TimestampInterval } from '@haskou/value-objects';

const start = new Timestamp('2026-06-01T00:00:00Z');
const end = new Timestamp('2026-06-03T00:00:00Z');
const interval = new TimestampInterval(start, end);

interval.getDuration().getTotalDays().valueOf(); // 2
interval.includes(start); // true
```

## Notes

- Interval boundaries cannot be changed after construction.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

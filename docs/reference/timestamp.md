---
title: Timestamp
description: UTC timestamp value object stored as milliseconds.
---

# `Timestamp`

UTC timestamp value object stored as milliseconds.

## Import

```typescript
import { Timestamp } from '@haskou/value-objects';
```

## Signature

```typescript
class Timestamp extends ValueObject<number>
```

## Constructor

```typescript
constructor(value?: number | Date | Timestamp | string)
```

## Validation

String values are parsed with `new Date(value)`. Inputs that produce an invalid ECMAScript `Date`, including non-finite and out-of-range millisecond values, are rejected with `InvalidNumberError`.

## Methods

| Method                        | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `static new(value)`           | Creates a new `Timestamp`.                              |
| `static now()`                | Creates a timestamp for the current time.               |
| `static fromSeconds(seconds)` | Creates from seconds.                                   |
| `toExactHour()`               | Returns a timestamp rounded down to the exact UTC hour. |
| `toMilliseconds()`            | Returns milliseconds.                                   |
| `toSeconds()`                 | Returns rounded seconds.                                |
| `toDate()`                    | Returns a `Date`.                                       |
| `isBefore(other)`             | Compares milliseconds.                                  |
| `isAfter(other)`              | Compares milliseconds.                                  |
| `isBeforeOrEqual(other)`      | Compares milliseconds.                                  |
| `isAfterOrEqual(other)`       | Compares milliseconds.                                  |
| `addMilliseconds(value)`      | Returns a new timestamp.                                |
| `addSeconds(value)`           | Returns a new timestamp.                                |
| `addMinutes(value)`           | Returns a new timestamp.                                |
| `addHours(value)`             | Returns a new timestamp.                                |
| `addDays(value)`              | Returns a new timestamp.                                |
| `addWeeks(value)`             | Returns a new timestamp.                                |
| `addMonths(value)`            | Adds whole UTC calendar months, clamping when needed.   |
| `addYears(value)`             | Adds whole UTC calendar years, clamping when needed.    |
| `addDuration(duration)`       | Adds a `Duration`.                                      |
| `isSameDay(other)`            | Compares `CalendarDay`.                                 |
| `isSameMonth(other)`          | Compares `MonthOfYear`.                                 |
| `isSameYear(other)`           | Compares `Year`.                                        |
| `getCalendarDay()`            | Returns a `CalendarDay`.                                |
| `getDay()`                    | Returns a UTC `Day`.                                    |
| `getMonth()`                  | Returns a UTC `Month`.                                  |
| `getYear()`                   | Returns a UTC `Year`.                                   |
| `getHours()`                  | Returns UTC hours.                                      |
| `getMinutes()`                | Returns UTC minutes.                                    |
| `getSeconds()`                | Returns UTC seconds.                                    |
| `getMilliseconds()`           | Returns UTC milliseconds.                               |
| `getDayOfWeek()`              | Returns JavaScript UTC day number.                      |
| `getMonthOfYear()`            | Returns `MonthOfYear`.                                  |

## Example

```typescript
import { Timestamp } from '@haskou/value-objects';

const timestamp = new Timestamp('2026-01-31T10:00:00.000Z');

timestamp.addMonths(1).toDate().toISOString(); // '2026-02-28T10:00:00.000Z'
timestamp.getYear().valueOf(); // 2026
```

## Notes

- All date component getters and calendar arithmetic use UTC.
- `addMonths()` and `addYears()` require integer deltas; fractional calendar units throw `InvalidIntegerError` instead of relying on JavaScript `Date` coercion.
- `addMonths()` preserves the day when possible and clamps to the last valid day of the target month otherwise.
- `addYears()` preserves month/day when possible and clamps leap-day results to the last valid day of February.
- Calendar arithmetic preserves the timestamp's fractional millisecond component even though JavaScript `Date` itself has integer-millisecond precision.
- Calendar arithmetic avoids out-of-range intermediate `Date` values at the ECMAScript timestamp boundaries.
- `addDays()`, `addWeeks()`, `addHours()`, and smaller units remain fixed-duration arithmetic.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

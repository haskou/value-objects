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
| `addMonths(value)`            | Uses a fixed 30-day month factor.                       |
| `addYears(value)`             | Uses a fixed 365-day year factor.                       |
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

const timestamp = new Timestamp('2026-06-23T10:00:00.000Z');

timestamp.addHours(2).toDate().toISOString(); // '2026-06-23T12:00:00.000Z'
timestamp.getYear().valueOf(); // 2026
```

## Notes

- All date component getters use UTC.
- `addMonths()` and `addYears()` use fixed duration factors, not calendar arithmetic.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: CalendarDay
description: UTC calendar day value object formatted as YYYY-MM-DD.
---

# `CalendarDay`

UTC calendar day value object formatted as YYYY-MM-DD.

## Import

```typescript
import { CalendarDay } from '@haskou/value-objects';
```

## Signature

```typescript
class CalendarDay extends ValueObject<string>
```

## Constructor

```typescript
constructor(value?: string | Date | number | Timestamp)
```

## Validation

String input must match `YYYY-M-D` or `YYYY-MM-DD` style and resolve to a valid date.

## Throws

This class can throw:

- `InvalidDayError`
- `InvalidDayFormatError`

## Methods

| Method | Description |
| --- | --- |
| `getYear()` | Returns the numeric year. |
| `getMonth()` | Returns a `Month`. |
| `getMonthOfYear()` | Returns a `MonthOfYear`. |
| `getDay()` | Returns a `Day`. |
| `getDayOfWeek()` | Returns a `DayOfWeek`. |
| `toTimestamp()` | Returns a UTC timestamp for the day. |
| `isBefore(date)` | Compares by `YYYY-MM-DD` string value. |
| `isAfter(date)` | Compares by `YYYY-MM-DD` string value. |

## Example

```typescript
import { CalendarDay } from '@haskou/value-objects';

const day = new CalendarDay('2026-06-23');

day.toString(); // '2026-06-23'
day.getMonth().valueOf(); // 6
day.getDayOfWeek().toString(); // depends on date
```

## Notes

- When no value is provided, it uses the current timestamp.
- Internally it uses UTC date getters through `Timestamp`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

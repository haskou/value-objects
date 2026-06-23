---
title: MonthOfYear
description: Month and year pair formatted as YYYY/MM.
---

# `MonthOfYear`

Month and year pair formatted as YYYY/MM.

## Import

```typescript
import { MonthOfYear } from '@haskou/value-objects';
```

## Signature

```typescript
class MonthOfYear extends ValueObject<string>
```

## Constructor

```typescript
constructor(month: number | Month, year: number | Year)
```

## Validation

Month and year are validated through `Month` and `Year`.

## Methods

| Method | Description |
| --- | --- |
| `static fromTimestamp(timestamp)` | Creates a month/year from a timestamp. |
| `static fromString(value)` | Parses `YYYY/MM`. |
| `getMonth()` | Returns a `Month`. |
| `getYear()` | Returns a `Year`. |
| `getNumberOfDays()` | Returns the number of days in that month. |
| `getTimestampInterval()` | Returns a `TimestampInterval` from first day to last day. |

## Example

```typescript
import { MonthOfYear } from '@haskou/value-objects';

const month = new MonthOfYear(2, 2024);

month.toString(); // '2024/02'
month.getNumberOfDays(); // 29
```

## Notes

- The output always pads the month to two digits.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: Error handling
description: Error handling guide for @haskou/value-objects
---

# Error handling

Most validation failures throw specific errors. Catch the specific error when code needs to distinguish between invalid value categories.

```typescript
import { Email, InvalidEmailError } from '@haskou/value-objects';

try {
  new Email('invalid');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    // Invalid email format.
  }
}
```

## Common errors

| Error | Usually thrown by |
| --- | --- |
| `InvalidStringLengthError` | `StringValueObject` |
| `InvalidPasswordError` | `Password` |
| `InvalidNumberError` | `NumberValueObject` |
| `InvalidIntegerError` | `Integer`, `Year`, `Day` |
| `InvalidPositiveNumberError` | `PositiveNumber` |
| `InvalidEmailError` | `Email` |
| `InvalidColorError` | `Color` |
| `InvalidLengthError` | IDs, keys, payloads |
| `InvalidFormatError` | IDs, keys, payloads |
| `InvalidHashError` | Hash classes |
| `InvalidDayError` | `Day`, `CalendarDay`, `DayOfWeek` |
| `InvalidDayFormatError` | `CalendarDay` |
| `InvalidHourError` | `Hour` |
| `InvalidMinutesError` | `Hour` |
| `InvalidTimestampIntervalError` | `TimestampInterval` |
| `ValueNotInEnumError` | `Enum` subclasses |
| `NullObjectError` | Calling a fake method on a null object |

## Pattern

```typescript
function parseEmail(value: string): Email | null {
  try {
    return new Email(value);
  } catch (error) {
    if (error instanceof InvalidEmailError) {
      return null;
    }

    throw error;
  }
}
```

Keep catch blocks narrow. Broadly swallowing validation errors is how data quality goes to die quietly in production.

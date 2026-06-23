---
title: Duration
description: Duration value object stored in milliseconds.
---

# `Duration`

Duration value object stored in milliseconds.

## Import

```typescript
import { Duration } from '@haskou/value-objects';
```

## Signature

```typescript
class Duration extends NumberValueObject
```

## Constructor

```typescript
constructor(milliseconds: NumberValueObject | Duration)
```

## Validation

Uses `NumberValueObject` validation.

## Methods

| Method | Description |
| --- | --- |
| `static fromDays(days)` | Creates a duration from days. |
| `static fromHours(hours)` | Creates a duration from hours. |
| `static fromMinutes(minutes)` | Creates a duration from minutes. |
| `static fromSeconds(seconds)` | Creates a duration from seconds. |
| `static fromMilliseconds(milliseconds)` | Creates a duration from milliseconds. |
| `getTotalDays()` | Returns total days as `NumberValueObject`. |
| `getTotalHours()` | Returns total hours as `NumberValueObject`. |
| `getTotalMinutes()` | Returns total minutes as `NumberValueObject`. |
| `getTotalSeconds()` | Returns total seconds as `NumberValueObject`. |
| `getTotalMilliseconds()` | Returns total milliseconds as `NumberValueObject`. |
| `getDays()` | Returns the day component. |
| `getHours()` | Returns the hour component. |
| `getMinutes()` | Returns the minute component. |
| `getSeconds()` | Returns the second component. |
| `getMilliseconds()` | Returns the millisecond component. |

## Example

```typescript
import { Duration } from '@haskou/value-objects';

const duration = Duration.fromMinutes(90);

duration.valueOf(); // 5400000
duration.getTotalHours().valueOf(); // 1.5
```

## Notes

- Month and year factors are fixed approximations: 30 days and 365 days.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

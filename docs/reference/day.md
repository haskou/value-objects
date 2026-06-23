---
title: Day
description: Day-of-month value object.
---

# `Day`

Day-of-month value object.

## Import

```typescript
import { Day } from '@haskou/value-objects';
```

## Signature

```typescript
class Day extends Integer
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

Must be between `1` and `31`, inclusive.

## Throws

This class can throw:

- `InvalidDayError`

## Example

```typescript
import { Day } from '@haskou/value-objects';

const day = new Day(23);
day.valueOf(); // 23
```

## Notes

- It does not know which month it belongs to. `31` is valid even for months that do not have 31 days.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

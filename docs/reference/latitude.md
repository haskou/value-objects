---
title: Latitude
description: Latitude value object.
---

# `Latitude`

Latitude value object.

## Import

```typescript
import { Latitude } from '@haskou/value-objects';
```

## Signature

```typescript
class Latitude extends NumberValueObject
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

Must be between `-90` and `90`, inclusive.

## Throws

This class can throw:

- `InvalidLatitudeError`

## Example

```typescript
import { Latitude } from '@haskou/value-objects';

const latitude = new Latitude(41.3888);
latitude.valueOf(); // 41.3888
```

## Notes

- Accepts primitive numbers and `NumberValueObject` instances.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

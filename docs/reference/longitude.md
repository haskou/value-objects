---
title: Longitude
description: Longitude value object.
---

# `Longitude`

Longitude value object.

## Import

```typescript
import { Longitude } from '@haskou/value-objects';
```

## Signature

```typescript
class Longitude extends NumberValueObject
```

## Constructor

```typescript
constructor(value: number | NumberValueObject)
```

## Validation

Must be between `-180` and `180`, inclusive.

## Throws

This class can throw:

- `InvalidLongitudeError`

## Example

```typescript
import { Longitude } from '@haskou/value-objects';

const longitude = new Longitude(2.159);
longitude.valueOf(); // 2.159
```

## Notes

- Accepts primitive numbers and `NumberValueObject` instances.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

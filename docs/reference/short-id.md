---
title: ShortId
description: MongoDB ObjectId-like 24-character identifier.
---

# `ShortId`

MongoDB ObjectId-like 24-character identifier.

## Import

```typescript
import { ShortId } from '@haskou/value-objects';
```

## Signature

```typescript
class ShortId extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must be exactly 24 alphanumeric characters according to the current pattern.

## Throws

This class can throw:

- `InvalidLengthError`
- `InvalidFormatError`

## Methods

| Method | Description |
| --- | --- |
| `static generate()` | Generates a 24-character hex string using random bytes with a timestamp prefix. |

## Example

```typescript
import { ShortId } from '@haskou/value-objects';

const id = ShortId.generate();
id.toString(); // e.g. '69ad70897364ee0d1406b1d0'

const existing = new ShortId('507f1f77bcf86cd799439011');
```

## Notes

- Generation returns lowercase hex.
- Constructor validation currently allows alphanumeric characters, not only lowercase hex.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

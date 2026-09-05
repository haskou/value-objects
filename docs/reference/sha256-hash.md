---
title: SHA256Hash
description: SHA-256 hash value object.
---

# `SHA256Hash`

SHA-256 hash value object for representing and validating an existing digest.

## Import

```typescript
import { SHA256Hash } from '@haskou/value-objects';
```

## Signature

```typescript
class SHA256Hash extends ValueObject<string>
```

## Constructor

```typescript
constructor(source: string | StringValueObject)
```

## Validation

Must be a 64-character hex SHA-256 hash.

## Throws

This class can throw:

- `InvalidHashError`

## Methods

| Method | Description |
| --- | --- |
| `static isValid(hash)` | Returns true when the value matches the SHA-256 hash pattern. |
| `toBase64()` | Converts the hex hash to a Base64 `StringValueObject`. |

## Example

```typescript
import { SHA256Hash } from '@haskou/value-objects';

const hash = new SHA256Hash(
  '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
);
hash.toString().length; // 64
```

## Notes

- Validation is case-insensitive.
- This package validates SHA-256 values; digest computation belongs to `@haskou/crypto`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: SHA512Hash
description: SHA-512 hash value object.
---

# `SHA512Hash`

SHA-512 hash value object for representing and validating an existing digest.

## Import

```typescript
import { SHA512Hash } from '@haskou/value-objects';
```

## Signature

```typescript
class SHA512Hash extends ValueObject<string>
```

## Constructor

```typescript
constructor(source: string | StringValueObject)
```

## Validation

Must be a 128-character hex SHA-512 hash.

## Throws

This class can throw:

- `InvalidHashError`

## Methods

| Method | Description |
| --- | --- |
| `static isValid(hash)` | Returns true when the value matches the SHA-512 hash pattern. |
| `toBase64()` | Converts the hex hash to a Base64 `StringValueObject`. |

## Example

```typescript
import { SHA512Hash } from '@haskou/value-objects';

const hash = new SHA512Hash(
  '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
);
hash.toString().length; // 128
```

## Notes

- Validation is case-insensitive.
- This package validates SHA-512 values; digest computation belongs to `@haskou/crypto`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

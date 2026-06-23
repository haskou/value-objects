---
title: SHA256Hash
description: SHA-256 hash value object.
---

# `SHA256Hash`

SHA-256 hash value object.

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
| `static from(buffer)` | Hashes a string, `StringValueObject`, `Media`, or `Buffer`. |
| `toBase64()` | Converts the hex hash to a Base64 `StringValueObject`. |

## Example

```typescript
import { SHA256Hash } from '@haskou/value-objects';

const hash = SHA256Hash.from('hello');
hash.toString().length; // 64
```

## Notes

- Validation is case-insensitive.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

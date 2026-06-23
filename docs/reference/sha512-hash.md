---
title: SHA512Hash
description: SHA-512 hash value object.
---

# `SHA512Hash`

SHA-512 hash value object.

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
| `static from(buffer)` | Hashes a string, `StringValueObject`, `Media`, or `Buffer`. |
| `toBase64()` | Converts the hex hash to a Base64 `StringValueObject`. |

## Example

```typescript
import { SHA512Hash } from '@haskou/value-objects';

const hash = SHA512Hash.from('hello');
hash.toString().length; // 128
```

## Notes

- Validation is case-insensitive.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

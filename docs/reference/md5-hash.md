---
title: MD5Hash
description: MD5 hash value object.
---

# `MD5Hash`

MD5 hash value object.

## Import

```typescript
import { MD5Hash } from '@haskou/value-objects';
```

## Signature

```typescript
class MD5Hash extends Hash
```

## Constructor

```typescript
constructor(source: string | StringValueObject)
```

## Validation

Must be a 32-character lowercase hex MD5 hash.

## Throws

This class can throw:

- `InvalidHashError`

## Methods

| Method | Description |
| --- | --- |
| `static isValid(hash)` | Returns true when the value matches the MD5 hash pattern. |
| `static from(buffer)` | Hashes a string, `StringValueObject`, `Media`, or `Buffer`. |
| `toBase64()` | Inherited from `Hash`. |

## Example

```typescript
import { MD5Hash } from '@haskou/value-objects';

const hash = MD5Hash.from('hello');
hash.toString(); // '5d41402abc4b2a76b9719d911017c592'
```

## Notes

- MD5 is available for compatibility and identifiers. Do not use MD5 as a secure password hash.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

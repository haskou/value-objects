---
title: Signature
description: Base64 encoded Ed25519 signature value object.
---

# `Signature`

Base64 encoded Ed25519 signature value object.

## Import

```typescript
import { Signature } from '@haskou/value-objects';
```

## Signature

```typescript
class Signature extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must match the package Base64 signature pattern and be 88 characters long.

## Throws

This class can throw:

- `InvalidSignatureError`

## Methods

| Method | Description |
| --- | --- |
| `static fromBuffer(buffer)` | Creates a signature from raw signature bytes. |

## Example

```typescript
import { PrivateKey } from '@haskou/value-objects';

const privateKey = PrivateKey.generate();
const signature = privateKey.sign('payload');

signature.valueOf().length; // 88
```

## Notes

- Normally created through `PrivateKey.sign()` or `KeyPair.sign()`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: PublicKey
description: Ed25519 public key in PEM SPKI format.
---

# `PublicKey`

Ed25519 public key in PEM SPKI format.

## Import

```typescript
import { PublicKey } from '@haskou/value-objects';
```

## Signature

```typescript
class PublicKey extends Key
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must be a 113-character PEM public key matching the package pattern.

## Throws

This class can throw:

- `InvalidLengthError`
- `InvalidFormatError`

## Methods

| Method | Description |
| --- | --- |
| `static fromPEM(pem)` | Creates a public key from PEM. |
| `isValidSignature(payload, signature)` | Verifies a signature for a payload. |
| `encrypt(payload)` | Encrypts payload data and returns `AsymmetricEncryptedPayload`. |

## Example

```typescript
import { PrivateKey } from '@haskou/value-objects';

const privateKey = PrivateKey.generate();
const publicKey = privateKey.getPublicKey();
const payload = publicKey.encrypt('secret');

privateKey.decrypt(payload).toString(); // 'secret'
```

## Notes

- Asymmetric encryption is capped at 1 MiB before encryption.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

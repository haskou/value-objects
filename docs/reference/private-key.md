---
title: PrivateKey
description: Ed25519 private key in PEM PKCS8 format.
---

# `PrivateKey`

Ed25519 private key in PEM PKCS8 format.

## Import

```typescript
import { PrivateKey } from '@haskou/value-objects';
```

## Signature

```typescript
class PrivateKey extends Key
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must be a 119-character PEM private key matching the package pattern.

## Throws

This class can throw:

- `InvalidLengthError`
- `InvalidFormatError`

## Methods

| Method | Description |
| --- | --- |
| `static fromPEM(pem)` | Creates a private key from PEM. |
| `static generate()` | Generates a new private key. |
| `getPublicKey()` | Derives the matching `PublicKey`. |
| `sign(payload)` | Signs a string-like payload or `Media` and returns `Signature`. |
| `decrypt(encryptedPayload)` | Decrypts asymmetric encrypted payloads addressed to the matching key. |

## Example

```typescript
import { PrivateKey } from '@haskou/value-objects';

const privateKey = PrivateKey.generate();
const publicKey = privateKey.getPublicKey();
const signature = privateKey.sign('hello');

publicKey.isValidSignature('hello', signature); // true
```

## Notes

- Payload decryption supports the current v2 asymmetric payload format and the legacy four-part format.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

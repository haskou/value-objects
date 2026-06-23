---
title: KeyPair
description: Plain public/private key pair helper.
---

# `KeyPair`

Plain public/private key pair helper.

## Import

```typescript
import { KeyPair } from '@haskou/value-objects';
```

## Signature

```typescript
class KeyPair
```

## Constructor

```typescript
constructor(publicKey: PublicKey, privateKey: PrivateKey)
```

## Validation

The constructor relies on `PublicKey` and `PrivateKey` validation.

## Methods

| Method | Description |
| --- | --- |
| `static generate()` | Generates a new key pair. |
| `static fromPrimitives(primitives)` | Restores from `{ publicKey, privateKey }`. |
| `encryptKeyPair(password)` | Returns an `EncryptedKeyPair`. |
| `isValidSignature(payload, signature)` | Verifies with the public key. |
| `sign(payload)` | Signs with the private key. |
| `toPrimitives()` | Returns `{ privateKey, publicKey }`. |
| `encrypt(payload)` | Encrypts with the public key. |
| `decrypt(encryptedPayload)` | Decrypts with the private key. |

## Example

```typescript
import { KeyPair, Password } from '@haskou/value-objects';

const keyPair = await KeyPair.generate();
const signature = keyPair.sign('message');

keyPair.isValidSignature('message', signature); // true

const encrypted = await keyPair.encryptKeyPair(
  new Password('Secure-password-123!'),
);
```

## Notes

- `toPrimitives()` includes the raw private key. Store it carefully.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

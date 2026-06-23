---
title: EncryptedKeyPair
description: Public key plus encrypted private key helper.
---

# `EncryptedKeyPair`

Public key plus encrypted private key helper.

## Import

```typescript
import { EncryptedKeyPair } from '@haskou/value-objects';
```

## Signature

```typescript
class EncryptedKeyPair
```

## Constructor

```typescript
constructor(publicKey: PublicKey, encryptedPrivateKey: EncryptedPrivateKey)
```

## Validation

The constructor relies on `PublicKey` and `EncryptedPrivateKey` validation.

## Methods

| Method | Description |
| --- | --- |
| `static encryptKeyPair(publicKey, privateKey, password)` | Encrypts the private key and returns an encrypted pair. |
| `static fromPrimitives(primitives)` | Restores from `{ publicKey, encryptedPrivateKey }`. |
| `isValidSignature(payload, signature)` | Verifies using the public key. |
| `sign(payload, password)` | Decrypts the private key internally and signs. |
| `toPrimitives()` | Returns `{ encryptedPrivateKey, publicKey }`. |
| `encrypt(payload)` | Encrypts using the public key. |
| `decrypt(encryptedPayload, password)` | Decrypts after unlocking the private key. |

## Example

```typescript
import { KeyPair, Password } from '@haskou/value-objects';

const keyPair = await KeyPair.generate();
const password = new Password('Secure-password-123!');
const encryptedPair = await keyPair.encryptKeyPair(password);

const payload = encryptedPair.encrypt('secret');
const plaintext = await encryptedPair.decrypt(payload, password);

plaintext.toString(); // 'secret'
```

## Notes

- Signing and decrypting require the password. Verification and encryption do not.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: EncryptedPrivateKey
description: Password-protected private key container.
---

# `EncryptedPrivateKey`

Password-protected private key container.

## Import

```typescript
import { EncryptedPrivateKey } from '@haskou/value-objects';
```

## Signature

```typescript
class EncryptedPrivateKey extends ValueObject<string>
```

## Constructor

```typescript
constructor(encryptedPrivateKey: string | StringValueObject)
```

## Validation

Accepted formats are delegated to version handlers. Unknown formats throw during `decrypt()`.

## Throws

This class can throw:

- `InvalidEncryptedPrivateKeyFormatError`

## Methods

| Method | Description |
| --- | --- |
| `static create(privateKey, password)` | Encrypts a private key using the current v3 format. |
| `decrypt(password)` | Decrypts and returns a `PrivateKey`. |
| `needsReEncryption()` | Returns true when the stored format should be upgraded. |

## Example

```typescript
import { EncryptedPrivateKey, Password, PrivateKey } from '@haskou/value-objects';

const privateKey = PrivateKey.generate();
const password = new Password('Secure-password-123!');
const encrypted = await EncryptedPrivateKey.create(privateKey, password);

const restored = await encrypted.decrypt(password);
restored.isEqual(privateKey); // true
```

## Notes

- New encrypted private keys use the v3 handler.
- Legacy and v2 formats are still readable when recognized by the internal handlers.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: SymmetricKey
description: AES-256-GCM symmetric key value object.
---

# `SymmetricKey`

AES-256-GCM symmetric key value object.

## Import

```typescript
import { SymmetricKey } from '@haskou/value-objects';
```

## Signature

```typescript
class SymmetricKey extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must be strict Base64 and decode to exactly 32 bytes.

## Throws

This class can throw:

- `InvalidFormatError`
- `InvalidLengthError`

## Methods

| Method | Description |
| --- | --- |
| `static fromBase64(key)` | Creates from Base64. |
| `static fromBuffer(key)` | Creates from a 32-byte Buffer. |
| `static generate()` | Creates a random 32-byte key. |
| `static fromPassword(password, options)` | Derives a key with scrypt using explicit salt and optional parameters. |
| `static fromPasswordUsingOwasp(password, options)` | Derives using the package OWASP-aligned scrypt profile. |
| `getBuffer()` | Returns the key as a Buffer. |
| `encrypt(payload, options?)` | Encrypts with AES-256-GCM and returns `SymmetricEncryptedPayload`. |
| `decrypt(encryptedPayload, options?)` | Decrypts and returns a Buffer. |

## Example

```typescript
import { Password, SymmetricKey } from '@haskou/value-objects';

const key = SymmetricKey.generate();
const encrypted = key.encrypt('secret');

key.decrypt(encrypted).toString(); // 'secret'

const derived = await SymmetricKey.fromPasswordUsingOwasp(
  new Password('Secure-password-123!'),
  { salt: 'application-specific-salt' },
);
```

## Notes

- Payload encryption is capped at 8 MiB before encryption.
- Password-derived keys require callers to store or reproduce the salt. The salt is not embedded in `SymmetricEncryptedPayload`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: AsymmetricEncryptedPayload
description: Encrypted payload addressed to a public key.
---

# `AsymmetricEncryptedPayload`

Encrypted payload addressed to a public key.

## Import

```typescript
import { AsymmetricEncryptedPayload } from '@haskou/value-objects';
```

## Signature

```typescript
class AsymmetricEncryptedPayload extends EncryptedPayload
```

## Constructor

```typescript
constructor(value: string)
```

## Validation

Created by public-key encryption helpers. Recognized as asymmetric by `getScheme()`.

## Methods

| Method | Description |
| --- | --- |
| `getScheme()` | Returns `'asymmetric'`. |

## Example

```typescript
import { KeyPair } from '@haskou/value-objects';

const keyPair = await KeyPair.generate();
const encrypted = keyPair.encrypt('secret');

encrypted.getScheme(); // 'asymmetric'
```

## Notes

- Current format starts with `v2.x25519-hkdf-sha256-aes-256-gcm`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

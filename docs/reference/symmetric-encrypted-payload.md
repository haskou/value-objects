---
title: SymmetricEncryptedPayload
description: Encrypted payload produced by `SymmetricKey`.
---

# `SymmetricEncryptedPayload`

Encrypted payload produced by `SymmetricKey`.

## Import

```typescript
import { SymmetricEncryptedPayload } from '@haskou/value-objects';
```

## Signature

```typescript
class SymmetricEncryptedPayload extends EncryptedPayload
```

## Constructor

```typescript
constructor(value: string)
```

## Validation

Created by `SymmetricKey.encrypt()`. Recognized as symmetric by `getScheme()`.

## Methods

| Method | Description |
| --- | --- |
| `getScheme()` | Returns `'symmetric'`. |

## Example

```typescript
import { SymmetricKey } from '@haskou/value-objects';

const key = SymmetricKey.generate();
const encrypted = key.encrypt('secret');

encrypted.getScheme(); // 'symmetric'
```

## Notes

- Current format starts with `v1.aes-256-gcm`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: EncryptedPayload
description: Base dot-separated encrypted payload container.
---

# `EncryptedPayload`

Base dot-separated encrypted payload container.

## Import

```typescript
import { EncryptedPayload } from '@haskou/value-objects';
```

## Signature

```typescript
class EncryptedPayload extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string)
```

## Validation

Stores the payload string. Scheme detection is done by shape.

## Methods

| Method | Description |
| --- | --- |
| `getScheme()` | Returns `'asymmetric'`, `'symmetric'`, or `'unknown'`. |

## Example

```typescript
import { EncryptedPayload } from '@haskou/value-objects';

const payload = new EncryptedPayload('v1.aes-256-gcm.iv.cipherText.tag');
payload.getScheme(); // 'symmetric'
```

## Notes

- Used as the base type accepted by decryptors.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

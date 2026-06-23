---
title: Key
description: Abstract base class for PEM key value objects.
---

# `Key`

Abstract base class for PEM key value objects.

## Import

```typescript
import { Key } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class Key extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Concrete key classes validate PEM format and length.

## Example

```typescript
import { PrivateKey } from '@haskou/value-objects';

const privateKey = PrivateKey.generate();
privateKey.valueOf(); // PEM string
```

## Notes

- Use `PrivateKey` or `PublicKey` directly.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: Hash
description: Abstract base class for hash value objects.
---

# `Hash`

Abstract base class for hash value objects.

## Import

```typescript
import { Hash } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class Hash extends ValueObject<string>
```

## Constructor

```typescript
constructor(source: string | StringValueObject)
```

## Validation

Concrete subclasses validate length and algorithm-specific format.

## Methods

| Method | Description |
| --- | --- |
| `toBase64()` | Converts the hex hash into a Base64 `StringValueObject`. |

## Example

```typescript
import { MD5Hash } from '@haskou/value-objects';

const hash = MD5Hash.from('hello');
hash.toBase64().valueOf(); // 'XUFAKrxLKna5cZ2REBfFkg=='
```

## Notes

- Use concrete subclasses directly.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

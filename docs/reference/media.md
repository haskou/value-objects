---
title: Media
description: String or Buffer-backed media value object.
---

# `Media`

String or Buffer-backed media value object.

## Import

```typescript
import { Media } from '@haskou/value-objects';
```

## Signature

```typescript
class Media extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | Buffer)
```

## Validation

Accepts strings and Node `Buffer` values.

## Methods

| Method | Description |
| --- | --- |
| `getBuffer()` | Returns a defensive `Buffer` copy. |
| `getSize()` | Returns byte length. |
| `getBase64()` | Returns the content encoded as Base64. |
| `isEqual(other)` | Compares `Media` and `Buffer` values by bytes; falls back to value equality otherwise. |

## Example

```typescript
import { Media } from '@haskou/value-objects';

const media = new Media('hello world');

media.getSize(); // 11
media.getBase64(); // 'aGVsbG8gd29ybGQ='
media.getBuffer(); // Buffer
```

## Notes

- When constructed from a Buffer, the Buffer is copied. Returned buffers are also copies.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

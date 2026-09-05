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
| `hasValue(other)` | Compares Media, Buffer, or primitive values by their underlying bytes/value. |
| `isEqual(other)` | Requires another `Media` and compares its underlying bytes. |

## Example

```typescript
import { Buffer } from 'buffer';
import { Media } from '@haskou/value-objects';

const media = new Media('hello world');

media.getSize(); // 11
media.getBase64(); // 'aGVsbG8gd29ybGQ='
media.isEqual(new Media('hello world')); // true
media.hasValue(Buffer.from('hello world')); // true
```

## Notes

- When constructed from a Buffer, the Buffer is copied. Returned buffers are also copies.
- Use `isEqual()` for Media-to-Media equality and `hasValue()` when only the underlying content matters.

## Related

- [ValueObject equality](/reference/value-object)
- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

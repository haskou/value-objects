---
title: Media
description: String or Uint8Array-backed media value object.
---

# `Media`

String or `Uint8Array`-backed media value object.

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
constructor(value: string | Uint8Array)
```

## Validation

Accepts strings and `Uint8Array` values (Node `Buffer` is a `Uint8Array`).

## Methods

| Method | Description |
| --- | --- |
| `getBuffer()` | Returns a defensive `Uint8Array` copy. |
| `getSize()` | Returns byte length. |
| `getBase64()` | Returns the content encoded as Base64. |
| `hasValue(other)` | Compares Media, `Uint8Array`, or primitive values by their underlying bytes/value. |
| `isEqual(other)` | Requires another `Media` and compares its underlying bytes. |

## Example

```typescript
import { Media } from '@haskou/value-objects';

const media = new Media('hello world');

media.getSize(); // 11
media.getBase64(); // 'aGVsbG8gd29ybGQ='
media.isEqual(new Media('hello world')); // true
media.hasValue(new TextEncoder().encode('hello world')); // true
```

## Notes

- When constructed from bytes, the bytes are copied. Returned arrays are also copies.
- Text decoding of byte input is UTF-8 and keeps a leading BOM. Equality and `getBuffer()` use the original bytes.
- Use `isEqual()` for Media-to-Media equality and `hasValue()` when only the underlying content matters.

## Related

- [ValueObject equality](/reference/value-object)
- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

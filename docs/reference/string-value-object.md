---
title: StringValueObject
description: Immutable string wrapper with length validation.
---

# `StringValueObject`

Immutable string wrapper with length validation.

## Import

```typescript
import { StringValueObject } from '@haskou/value-objects';
```

## Signature

```typescript
class StringValueObject extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | StringValueObject, maxLength = 512)
```

## Validation

The string length must be less than or equal to `maxLength`.

## Throws

This class can throw:

- `InvalidStringLengthError`

## Methods

| Method | Description |
| --- | --- |
| `isEmpty()` | Returns true when the wrapped string is empty. |

## Example

```typescript
import { StringValueObject } from '@haskou/value-objects';

const title = new StringValueObject('hello');
const code = new StringValueObject('ABC', 3);

title.isEmpty(); // false
code.valueOf(); // 'ABC'
```

## Notes

- Passing another `StringValueObject` copies its primitive value.
- The default maximum length is 512 characters.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

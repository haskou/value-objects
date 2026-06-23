---
title: ValueObject
description: Base class for primitive value wrappers.
---

# `ValueObject`

Base class for primitive value wrappers.

## Import

```typescript
import { ValueObject } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class ValueObject<T extends Primitive = Primitive>
```

## Constructor

```typescript
constructor(value: T | null | undefined)
```

## Validation

Returns a null object when the constructor value is `null` or `undefined`; otherwise stores the primitive value.

## Methods

| Method | Description |
| --- | --- |
| `valueOf()` | Returns the wrapped primitive value. |
| `toString()` | Returns `valueOf().toString()`. |
| `isEqual(other)` | Compares by primitive value using `other?.valueOf()`. |
| `isNotEqual(other)` | Negates `isEqual()`. |
| `clone(value)` | Protected helper used by subclasses to return a new instance of the current class. |

## Example

```typescript
import { ValueObject } from '@haskou/value-objects';

class UserName extends ValueObject<string> {}

const name = new UserName('hasko');
name.valueOf(); // 'hasko'
name.isEqual('hasko'); // true
```

## Notes

- Use `ValueObject` when no extra validation is needed beyond null-object handling.
- Most concrete classes in this package extend it directly or indirectly.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

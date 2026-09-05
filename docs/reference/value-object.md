---
title: ValueObject
description: Base class for scalar value wrappers.
---

# `ValueObject`

Base class for scalar value wrappers.

## Import

```typescript
import { ValueObject } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class ValueObject<T extends Scalar = Scalar>
```

`Scalar` is `string | number | boolean | bigint | symbol`.

## Constructor

```typescript
constructor(value: T | null | undefined)
```

## Validation

Returns a null object when the constructor value is `null` or `undefined`; otherwise stores the scalar value.

Object and array values are intentionally excluded from the base class because `ValueObject.isEqual()` uses scalar identity (`===`) through `valueOf()`. Composite domain values should model their fields explicitly instead of inheriting reference equality accidentally.

## Methods

| Method | Description |
| --- | --- |
| `valueOf()` | Returns the wrapped scalar value. |
| `toString()` | Returns `valueOf().toString()`. |
| `isEqual(other)` | Compares by scalar value using `other?.valueOf()`. |
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
- Equality remains value-based and does not require matching Value Object classes.
- Most concrete classes in this package extend it directly or indirectly.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

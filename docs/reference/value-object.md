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

`Primitive` is `string | number | boolean | bigint | symbol | null | undefined`. Object and array values are intentionally excluded.

## Constructor

```typescript
constructor(value: T | null | undefined)
```

## Validation

Returns a null object when the constructor value is `null` or `undefined`; otherwise stores the primitive value.

Object and array values are intentionally excluded from `Primitive`. Composite domain values should model their fields explicitly instead of inheriting reference equality accidentally. Composite `toPrimitives()` serialization remains supported independently of this storage constraint.

## Equality and value comparison

`isEqual()` expresses Value Object equality: both objects must have the same concrete class and the same value.

`hasValue()` deliberately ignores the Value Object class and compares only the wrapped value. It can also compare directly against a primitive.

```typescript
class UserId extends ValueObject<string> {}
class CommunityId extends ValueObject<string> {}

const userId = new UserId('123');

userId.isEqual(new UserId('123')); // true
userId.isEqual(new CommunityId('123')); // false
userId.isEqual('123'); // false

userId.hasValue(new CommunityId('123')); // true
userId.hasValue('123'); // true
```

Specialized Value Objects may normalize value comparison by overriding `hasValue()`. `isEqual()` still requires the same concrete class before delegating to that value comparison.

## Methods

| Method | Description |
| --- | --- |
| `valueOf()` | Returns the wrapped primitive value. Null objects return `undefined`. |
| `toString()` | Returns `valueOf().toString()`. |
| `hasValue(other)` | Compares only the wrapped value; accepts another Value Object or a primitive. |
| `isEqual(other)` | Returns true only for the same concrete Value Object class with an equal value. |
| `isNotEqual(other)` | Negates `isEqual()`. |
| `clone(value)` | Protected helper used by subclasses to return a new instance of the current class. |

## Example

```typescript
import { ValueObject } from '@haskou/value-objects';

class UserName extends ValueObject<string> {}

const name = new UserName('hasko');
name.valueOf(); // 'hasko'
name.isEqual(new UserName('hasko')); // true
name.hasValue('hasko'); // true
```

## Notes

- Use `isEqual()` for domain equality between Value Objects.
- Use `hasValue()` only when comparing the underlying value is intentional.
- Most concrete classes in this package extend `ValueObject` directly or indirectly.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: NullObject
description: Factory and detector for null object instances.
---

# `NullObject`

Factory and detector for null object instances.

## Import

```typescript
import { NullObject, ValueObject } from '@haskou/value-objects';
```

## Signature

```typescript
abstract class NullObject
```

## Constructor

```typescript
Not constructed directly.
```

## Automatic creation

Automatic NullObject creation is enabled by default. Constructing a `ValueObject` with `null` or `undefined` returns a compatible null object.

Applications that prefer immediate failure can disable that behavior globally:

```typescript
ValueObject.disableNullObjectCreation();
```

With automatic creation disabled, nullish construction throws `NullObjectCreationDisabledError`. Restore the default behavior with `ValueObject.enableNullObjectCreation()`.

The setting is process-wide and should normally be configured once during application bootstrap.

## Validation

`NullObject.new()` creates an object with `isNullObject: true`, `valueOf(): undefined`, and fake methods that throw `NullObjectError`.

## Methods

| Method | Description |
| --- | --- |
| `static new(klass)` | Creates a null object compatible with the requested class. |
| `static isNullObject(value)` | Returns true when the value looks like a null object. |

## Example

```typescript
import { NullObject, StringValueObject } from '@haskou/value-objects';

const value = new StringValueObject(undefined as never);

NullObject.isNullObject(value); // true
value.valueOf(); // undefined
```

## Notes

- Calling most class methods on a null object throws `NullObjectError`.
- `ValueObject.disableNullObjectCreation()` does not remove `NullObject.new()`; explicit null objects remain available.

## Related

- [Null objects guide](/guides/null-object)
- [ValueObject](/reference/value-object)
- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

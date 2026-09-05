---
title: Null objects
description: Null object behavior in @haskou/value-objects
---

# Null objects

By default, `ValueObject` returns a null object when constructed with `null` or `undefined`.

```typescript
import { NullObject, StringValueObject } from '@haskou/value-objects';

const value = new StringValueObject(undefined as never);

NullObject.isNullObject(value); // true
value.valueOf(); // undefined
```

## Disable automatic creation

Applications that prefer explicit failures can disable automatic NullObject creation globally:

```typescript
import { ValueObject } from '@haskou/value-objects';

ValueObject.disableNullObjectCreation();

new StringValueObject(undefined as never);
// throws NullObjectCreationDisabledError
```

Restore the default behavior with:

```typescript
ValueObject.enableNullObjectCreation();
```

This setting is process-wide. Configure it once during application bootstrap rather than toggling it around individual domain operations.

## Method calls

Null objects expose fake methods from the target class. Calling those methods throws `NullObjectError`.

```typescript
const value = new StringValueObject(undefined as never);

value.isEmpty(); // throws NullObjectError
```

## When to check

```typescript
if (NullObject.isNullObject(value)) {
  // Handle missing value explicitly.
}
```

Use this when input can be absent and the calling code wants to preserve the value-object shape until a method is actually used. Use `disableNullObjectCreation()` instead when nullish construction should fail immediately.

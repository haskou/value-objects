---
title: Null objects
description: Null object behavior in @haskou/value-objects
---

# Null objects

`ValueObject` returns a null object when constructed with `null` or `undefined`.

```typescript
import { NullObject, StringValueObject } from '@haskou/value-objects';

const value = new StringValueObject(undefined as never);

NullObject.isNullObject(value); // true
value.valueOf(); // undefined
```

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

Use this when input can be absent and the calling code wants to preserve the value-object shape until a method is actually used.

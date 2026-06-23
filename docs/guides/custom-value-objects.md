---
title: Custom value objects
description: Create custom value objects with @haskou/value-objects
---

# Custom value objects

You can extend the base classes when the package does not include the exact value you need.

## Custom string value

```typescript
import {
  InvalidStringLengthError,
  StringValueObject,
} from '@haskou/value-objects';

class DisplayName extends StringValueObject {
  constructor(value: string | StringValueObject) {
    super(value, 80);
  }
}
```

## Custom number value

```typescript
import { NumberValueObject } from '@haskou/value-objects';

class Percentage extends NumberValueObject {
  constructor(value: number | NumberValueObject) {
    super(value);

    if (this.isLessThan(0) || this.isGreaterThan(100)) {
      throw new Error('Percentage must be between 0 and 100');
    }
  }
}
```

## Custom enum value

```typescript
import { Enum } from '@haskou/value-objects';

enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

class VisibilityValue extends Enum<string> {
  public getValues(): string[] {
    return Object.values(Visibility);
  }
}
```

## Tips

- Validate in the constructor.
- Prefer specific errors if callers need to branch on the failure.
- Keep methods small and tied to the wrapped value.
- Return new instances for operations that conceptually change the value.

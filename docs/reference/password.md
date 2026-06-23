---
title: Password
description: Validated password string value object.
---

# `Password`

Validated password string value object.

## Import

```typescript
import { Password } from '@haskou/value-objects';
```

## Signature

```typescript
class Password extends StringValueObject
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must be 12 to 256 characters long and include at least one uppercase letter, one lowercase letter, one number, and one non-alphanumeric symbol.

## Throws

This class can throw:

- `InvalidPasswordError`

## Example

```typescript
import { Password } from '@haskou/value-objects';

const password = new Password('Secure-password-123!');
password.valueOf(); // 'Secure-password-123!'
```

## Notes

- This class validates password shape only.
- It does not hash, store, or encrypt passwords by itself.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

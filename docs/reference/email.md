---
title: Email
description: Validated email address value object.
---

# `Email`

Validated email address value object.

## Import

```typescript
import { Email } from '@haskou/value-objects';
```

## Signature

```typescript
class Email extends StringValueObject
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must match `/^[\w+\-.]+@(?:[\w-]+\.)+[a-zA-Z]{2,13}$/`.

## Throws

This class can throw:

- `InvalidEmailError`

## Example

```typescript
import { Email } from '@haskou/value-objects';

const email = new Email('user+tag@example.co.uk');

email.valueOf(); // 'user+tag@example.co.uk'
email.isEqual('user+tag@example.co.uk'); // true
```

## Notes

- Validation is intentionally format-based.
- The class does not perform DNS checks, mailbox checks, or provider-specific normalization.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

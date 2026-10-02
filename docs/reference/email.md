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

Validation is intentionally pragmatic rather than a complete RFC 5322 parser. It accepts the package's previous address format and additionally supports modern long TLDs, punycode TLDs, and common ASCII local-part characters such as apostrophes.

Addresses are limited to 254 characters (RFC 5321) and local parts to 64. Domain labels accept only letters, digits and hyphens (1-63 characters, not starting or ending with a hyphen); underscores are rejected.

## Throws

This class can throw:

- `InvalidEmailError`
- `InvalidStringLengthError` when longer than 254 characters

## Example

```typescript
import { Email } from '@haskou/value-objects';

const email = new Email("o'hara+tag@example.technology");

email.valueOf(); // "o'hara+tag@example.technology"
email.isEqual(new Email("o'hara+tag@example.technology")); // true
email.hasValue("o'hara+tag@example.technology"); // true
```

## Notes

- `isEqual()` requires another `Email`; use `hasValue()` for deliberate primitive-value comparison.
- Validation is intentionally format-based.
- The class does not perform DNS checks, mailbox checks, or provider-specific normalization.

## Related

- [ValueObject equality](/reference/value-object)
- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

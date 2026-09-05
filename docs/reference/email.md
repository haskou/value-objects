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

## Throws

This class can throw:

- `InvalidEmailError`

## Example

```typescript
import { Email } from '@haskou/value-objects';

const email = new Email("o'hara+tag@example.technology");

email.valueOf(); // "o'hara+tag@example.technology"
email.isEqual("o'hara+tag@example.technology"); // true
```

## Notes

- Validation is intentionally format-based.
- The class does not perform DNS checks, mailbox checks, or provider-specific normalization.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

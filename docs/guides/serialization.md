---
title: Serialization
description: Serialization notes for @haskou/value-objects
---

# Serialization

Most value objects serialize through `valueOf()`.

```typescript
const email = new Email('user@example.com');

JSON.stringify({ email: email.valueOf() });
```

## Objects with primitive helpers

Some objects provide explicit primitive helpers.

```typescript
const interval = new TimestampInterval(start, end);
const primitives = interval.toPrimitives();
const restored = TimestampInterval.fromPrimitives(primitives);
```

`KeyPair` and `EncryptedKeyPair` also provide `toPrimitives()` / `fromPrimitives()` helpers.

## Rebuilding values

Deserialize by passing primitive values back into constructors or factory methods.

```typescript
const stored = {
  email: 'user@example.com',
  createdAt: 1782218400000,
};

const email = new Email(stored.email);
const createdAt = new Timestamp(stored.createdAt);
```

## Notes

- `valueOf()` is the safest default for persistence payloads.
- Use explicit helper methods when available.
- For encrypted data, persist all required fields, including salts when deriving keys from passwords.

---
title: Introduction
description: Introduction to @haskou/value-objects
---

# Introduction

`@haskou/value-objects` provides small immutable objects around primitive values.

A value object validates input at construction time, exposes a primitive through `valueOf()`, supports domain equality through `isEqual()`, and supports deliberate value-only comparison through `hasValue()`.

```typescript
import { Email, PositiveNumber } from '@haskou/value-objects';

const email = new Email('user@example.com');
const sameEmail = new Email('user@example.com');
const amount = new PositiveNumber(10);

email.valueOf(); // 'user@example.com'
email.isEqual(sameEmail); // true
email.hasValue('user@example.com'); // true
email.isEqual('user@example.com'); // false
amount.isGreaterThan(5); // true
```

`isEqual()` requires the same concrete Value Object type and an equal value. Use `hasValue()` when the domain type is intentionally irrelevant and only the wrapped value matters.

## What the package contains

| Area | Classes |
| --- | --- |
| Base | `ValueObject`, `NullObject`, `Enum` |
| Text | `StringValueObject`, `Password`, `Email`, `Color` |
| Numbers | `NumberValueObject`, `Integer`, `PositiveNumber` |
| IDs | `ShortId`, `UUID` |
| Time | `Timestamp`, `CalendarDay`, `Day`, `DayOfWeek`, `Duration`, `Hour`, `Month`, `MonthOfYear`, `TimestampInterval`, `Year` |
| Location | `Latitude`, `Longitude`, `Coordinates` |
| Hashes | `Hash`, `MD5Hash`, `SHA256Hash`, `SHA512Hash` |
| Media | `Media` |
| Collections | `UniqueObjectArray` |

Cryptographic behavior is intentionally not part of this generic package. Pigeon Swarm-specific cryptography lives in `@haskou/pigeon-swarm-crypto`, which may depend on `@haskou/value-objects`; the dependency never points back from this package into Pigeon Swarm.

The package provides separate ESM and CommonJS entry points and does not declare a Node.js engine requirement. Identifier generation uses the standard Web Crypto `crypto.getRandomValues` API.

## Design expectations

The package keeps the public API small:

- Construct an object.
- Let it validate itself.
- Use `isEqual()` for domain equality and `hasValue()` for value-only checks.
- Use `valueOf()`, `toString()`, or specific methods when the primitive or a specialized operation is required.
- Catch specific errors when invalid input matters.

The library is not tied to one architecture. Use it anywhere validated values help: request parsing, config loading, persistence mapping, tests, scripts, CLI tools, or application code.

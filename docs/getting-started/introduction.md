---
title: Introduction
description: Introduction to @haskou/value-objects
---

# Introduction

`@haskou/value-objects` provides small immutable objects around primitive values.

A value object validates input at construction time, exposes a primitive through `valueOf()`, supports value equality through `isEqual()`, and usually provides small helpers specific to that value.

```typescript
import { Email, PositiveNumber } from '@haskou/value-objects';

const email = new Email('user@example.com');
const amount = new PositiveNumber(10);

email.valueOf(); // 'user@example.com'
amount.isGreaterThan(5); // true
```

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
| Crypto | `Key`, `PrivateKey`, `PublicKey`, `Signature`, `KeyPair`, encrypted payload and key helpers |

## Design expectations

The package keeps the public API small:

- Construct an object.
- Let it validate itself.
- Use `valueOf()`, `toString()`, or specific methods.
- Catch specific errors when invalid input matters.

The library is not tied to one architecture. Use it anywhere validated values help: request parsing, config loading, persistence mapping, tests, scripts, CLI tools, or application code.

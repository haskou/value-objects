---
title: Documentation
description: Documentation for @haskou/value-objects.
---

# Value Objects documentation

A TypeScript library for validated, immutable primitive wrappers and small utility value objects.

::: info Documentation
This site is the main documentation for `@haskou/value-objects`.
Use it as the source of truth for installation, examples, errors, serialization notes, and the API reference.
:::

## Start here

- [Introduction](/getting-started/introduction)
- [Installation](/getting-started/installation)
- [Basic usage](/getting-started/basic-usage)
- [Guide](/guides/)
- [API reference](/reference/)

## Package

```bash
npm install @haskou/value-objects
```

```bash
yarn add @haskou/value-objects
```

## Reference sections

| Section | Contents |
| --- | --- |
| [Base objects](/reference/value-object) | `ValueObject`, `NullObject`, `Enum` |
| [Strings and numbers](/reference/string-value-object) | `StringValueObject`, `Email`, `Color`, `Password`, `NumberValueObject`, `Integer`, `PositiveNumber` |
| [Identifiers](/reference/uuid) | `UUID`, `ShortId` |
| [Time](/reference/timestamp) | `Timestamp`, `TimestampInterval`, `CalendarDay`, `Duration`, `Hour`, `Day`, `Year`, `Month`, `MonthOfYear`, `DayOfWeek` |
| [Coordinates](/reference/coordinates) | `Latitude`, `Longitude`, `Coordinates` |
| [Hashes](/reference/hash) | `Hash`, `MD5Hash`, `SHA256Hash`, `SHA512Hash` |
| [Media](/reference/media) | `Media` |
| [Collections](/reference/unique-object-array) | `UniqueObjectArray` |
| [Crypto helpers](/reference/crypto-notes) | `KeyPair`, `PrivateKey`, `PublicKey`, `SymmetricKey`, payload value objects |

## Agent skill

Reusable agent instructions and engineering skills live in [`haskou/ddd-engineer-skills`](https://github.com/haskou/ddd-engineer-skills).

This repository documents and ships the runtime library. The skill repository is separate on purpose.

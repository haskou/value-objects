# @haskou/value-objects

> Validated, immutable Value Objects for TypeScript and Domain-Driven Design.

Validate once, at the edge of your domain. Everything past that point receives a value that is already correct, with the behavior that belongs to it.

Dependency-less: zero runtime dependencies, for Node.js and browsers.

[![CI](https://github.com/haskou/value-objects/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/haskou/value-objects/actions/workflows/ci.yml?query=branch%3Amaster)
[![codecov](https://codecov.io/gh/haskou/value-objects/branch/master/graph/badge.svg)](https://codecov.io/gh/haskou/value-objects)
[![npm version](https://img.shields.io/npm/v/@haskou/value-objects.svg)](https://www.npmjs.com/package/@haskou/value-objects)
[![npm downloads](https://img.shields.io/npm/dw/@haskou/value-objects.svg)](https://www.npmjs.com/package/@haskou/value-objects)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/@haskou/value-objects?activeTab=dependencies)
[![license](https://img.shields.io/npm/l/@haskou/value-objects.svg)](LICENSE.txt)

```typescript
import { Hour, Money, Timestamp } from '@haskou/value-objects';

const price = Money.fromString('19.99€').multiply(3);
const opens = new Hour('09:30').addMinutes(45);

JSON.stringify({ price, at: new Timestamp(1782218400000) });
// {"price":"59.97 EUR","at":1782218400000}

opens.toString();
// '10:15'
```

Exact money arithmetic, time math and clean JSON, each type validating itself on construction.

## Installation

```bash
npm install @haskou/value-objects
```

```bash
yarn add @haskou/value-objects
```

## Why?

Primitive values force every consumer to defend itself.

```typescript
function sendEmail(email?: string | null) {
  if (email === null || email === undefined) {
    return;
  }

  if (email.length === 0) {
    throw new Error('Email cannot be empty');
  }

  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }

  // finally use the email
}
```

And another part of the application will eventually perform the same checks again, because `string` says nothing about what the value represents.

A Value Object moves those rules to the value itself:

```typescript
import { Email } from '@haskou/value-objects';

const email = new Email('user@example.com');

function sendEmail(email: Email) {
  // already a valid Email
}
```

A non-null `Email` has already passed format validation, so consumers do not need to repeat those checks.

```typescript
new Email('not-an-email');
// throws InvalidEmailError
```

The same idea applies to numbers, identifiers, dates, money, coordinates, hashes and your own domain concepts.

## Build your own domain Value Objects

The built-in Value Objects are also intended to be extended.

If your domain has a `Username`, it should not remain a generic `string` with validation scattered around the application.

```typescript
import { assert, NullObject, StringValueObject } from '@haskou/value-objects';

export class Username extends StringValueObject {
  constructor(value: string) {
    super(value, 30);

    if (NullObject.isNullObject(this)) return this;

    assert(!this.isEmpty(), 'Username cannot be empty');
    assert(value.length >= 3, 'Username must contain at least 3 characters');
    assert(
      /^[a-zA-Z0-9_]+$/.test(value),
      'Username contains invalid characters',
    );
  }
}
```

Now the rules belong to the domain type:

```typescript
const username = new Username('haskou');

function createUser(username: Username) {
  // no need to validate the username again
}
```

This is the main idea behind the library: use the provided Value Objects where they fit, and extend the base ones with your own domain invariants when they do not.

## Available Value Objects

| Category    | Classes                                                       | What they give you                                                |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| Base        | `ValueObject`, `NullObject`, `Enum`                           | Immutability, equality by value, safe absence                     |
| Strings     | `StringValueObject`, `Password`, `Email`, `Color`             | Length, format and emptiness rules                                |
| Numbers     | `NumberValueObject`, `Integer`, `PositiveNumber`              | Range and integer guarantees                                      |
| Money       | `Money`, `Currency`                                           | Exact arithmetic in minor units, no floating point errors         |
| Identifiers | `ShortId`, `UUID`                                             | Generated and validated identifiers                               |
| Date & time | `Timestamp`, `CalendarDay`, `Hour`, `Duration`, `MonthOfYear` | Arithmetic and comparison without hand-rolled `Date` code         |
| Coordinates | `Latitude`, `Longitude`, `Coordinates`                        | Range-checked geographic points                                   |
| Hashes      | `MD5Hash`, `SHA256Hash`, `SHA512Hash`                         | Validated digests                                                 |
| Media       | `Media`                                                       | Typed media references                                            |
| Collections | `UniqueObjectArray`                                           | Immutable collection without duplicates, by Value Object equality |

Every class has its own page in the [API reference](https://haskou.github.io/value-objects/reference/).

## How it compares

|                                              | Value Objects (this package) | Zod / schema validators | Branded primitives          | Hand-written classes  |
| -------------------------------------------- | ---------------------------- | ----------------------- | --------------------------- | --------------------- |
| Validates on construction                    | Yes                          | Yes, at parse time      | Only if you write the guard | Only if you write it  |
| Carries behaviour (`addMinutes`, `multiply`) | Yes                          | No                      | No                          | Yes, but you write it |
| Equality by value and class                  | Built in                     | No                      | No                          | You write it          |
| Immutable at runtime                         | Yes                          | No                      | No                          | You enforce it        |
| Represents missing values                    | `NullObject`                 | `undefined` checks      | `undefined` checks          | You decide            |
| Dependencies                                 | None                         | Zod itself              | None                        | None                  |

Choose schema validators to parse untrusted input shapes, and Value Objects for the domain types that input becomes. They combine well, see below.

## Integrations

### Zod

Parse at the boundary, then work with domain types.

```typescript
import { Email } from '@haskou/value-objects';
import { z } from 'zod';

const emailSchema = z.string().transform((value, context) => {
  try {
    return new Email(value);
  } catch (error) {
    context.addIssue({ code: 'custom', message: (error as Error).message });

    return z.NEVER;
  }
});

emailSchema.parse('user@example.com').valueOf(); // 'user@example.com'
emailSchema.safeParse('nope').success; // false
```

### Persistence and APIs

Value Objects serialize to their primitive through `toJSON()` and `valueOf()`, and are rebuilt by passing that primitive back to the constructor. Persistence layers only need to store the primitive.

```typescript
const stored = JSON.stringify({ email: new Email('user@example.com') });
// {"email":"user@example.com"}

const email = new Email(JSON.parse(stored).email);
```

## Quick start

```typescript
import { Color, Email, Hour, PositiveNumber } from '@haskou/value-objects';

const email = new Email('user@example.com');
const price = new PositiveNumber(29.99);
const color = new Color('#FF0000');
const hour = new Hour('09:30');

email.valueOf(); // 'user@example.com'
price.valueOf(); // 29.99
color.toString(); // '#FF0000'
hour.addMinutes(45).toString(); // '10:15'
```

Validation errors use specific error types:

```typescript
import { Email, InvalidEmailError } from '@haskou/value-objects';

try {
  new Email('not-an-email');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    // Handle invalid domain input.
  }
}
```

## Null without defensive programming

Missing values can be represented through the `NullObject` pattern instead of propagating `null | undefined` checks throughout the domain.

```typescript
import { NullObject, NumberValueObject } from '@haskou/value-objects';

const limit = new NumberValueObject(undefined as never);

NullObject.isNullObject(limit);
// true
```

The object can safely represent absence and pass through the domain without requiring:

```typescript
if (limit !== null && limit !== undefined) {
  // ...
}
```

But a `NullObject` does not silently pretend to contain a valid value.

Calling behaviour that requires that value fails explicitly:

```typescript
const limit = new NumberValueObject(undefined as never);

limit.isGreaterThan(10);
// throws NullObjectError
```

This lets missing values travel through the same domain abstraction while still failing immediately when code tries to actually use them.

Applications that prefer strict construction can disable automatic `NullObject` creation:

```typescript
import { NumberValueObject, ValueObject } from '@haskou/value-objects';

ValueObject.disableNullObjectCreation();

new NumberValueObject(undefined as never);
// throws NullObjectCreationDisabledError
```

## Assertions

The library exports an `assert` helper for expressing invariants without deeply nested validation branches.

Instead of:

```typescript
if (value !== undefined) {
  if (value.length > 0) {
    if (value.length <= 100) {
      // ...
    }
  }
}
```

Use:

```typescript
import { assert } from '@haskou/value-objects';

assert(value !== undefined, 'Value is required');
assert(value.length > 0, 'Value cannot be empty');
assert(value.length <= 100, 'Value is too long');
```

Failed assertions throw the supplied error, or a `DomainError` when given a string.

Successful assertions use TypeScript assertion signatures, so the condition is narrowed afterwards.

The package is framework-agnostic and can be used in any TypeScript domain layer regardless of the framework, ORM or persistence technology around it.

## Documentation

Full documentation:

https://haskou.github.io/value-objects/

API reference:

https://haskou.github.io/value-objects/reference/

## Contributing

Bug reports, feature requests and pull requests are welcome.

https://github.com/haskou/value-objects/issues

To work on the package locally:

```bash
git clone https://github.com/haskou/value-objects.git
cd value-objects

yarn install
yarn test
yarn build
```

## License

MIT. See [LICENSE.txt](LICENSE.txt).

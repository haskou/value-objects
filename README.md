# @haskou/value-objects

> Validated, immutable Value Objects for TypeScript and Domain-Driven Design.

Replace primitive obsession and defensive validation with domain-safe values that validate themselves.

[![CI](https://github.com/haskou/value-objects/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/haskou/value-objects/actions/workflows/ci.yml?query=branch%3Amaster)
[![codecov](https://codecov.io/gh/haskou/value-objects/branch/master/graph/badge.svg)](https://codecov.io/gh/haskou/value-objects)
[![npm version](https://img.shields.io/npm/v/@haskou/value-objects.svg)](https://www.npmjs.com/package/@haskou/value-objects)
[![npm downloads](https://img.shields.io/npm/dw/@haskou/value-objects.svg)](https://www.npmjs.com/package/@haskou/value-objects)
[![license](https://img.shields.io/npm/l/@haskou/value-objects.svg)](LICENSE.txt)

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

The same idea applies to numbers, identifiers, dates, coordinates, hashes and your own domain concepts.

Validation happens when values enter the domain instead of being repeated everywhere they are used.

## Build your own domain Value Objects

The built-in Value Objects are also intended to be extended.

If your domain has a `Username`, it should not remain a generic `string` with validation scattered around the application.

```typescript
import {
  assert,
  NullObject,
  StringValueObject,
} from '@haskou/value-objects';

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

## Null without defensive programming

Missing values can be represented through the `NullObject` pattern instead of propagating `null | undefined` checks throughout the domain.

```typescript
import {
  NullObject,
  NumberValueObject,
} from '@haskou/value-objects';

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
import {
  NumberValueObject,
  ValueObject,
} from '@haskou/value-objects';

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

## Quick start

```typescript
import {
  Color,
  Email,
  Hour,
  PositiveNumber,
} from '@haskou/value-objects';

const email = new Email('user@example.com');
const price = new PositiveNumber(29.99);
const color = new Color('#FF0000');
const hour = new Hour('09:30');

email.valueOf();                 // 'user@example.com'
price.valueOf();                 // 29.99
color.toString();                // '#FF0000'
hour.addMinutes(45).toString();  // '10:15'
```

Validation errors use specific error types:

```typescript
import {
  Email,
  InvalidEmailError,
} from '@haskou/value-objects';

try {
  new Email('not-an-email');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    // Handle invalid domain input.
  }
}
```

## Available Value Objects

| Category    | Examples                                                      |
| ----------- | ------------------------------------------------------------- |
| Base        | `ValueObject`, `NullObject`, `Enum`                           |
| Strings     | `StringValueObject`, `Password`, `Email`, `Color`             |
| Numbers     | `NumberValueObject`, `Integer`, `PositiveNumber`              |
| Identifiers | `ShortId`, `UUID`                                             |
| Date & time | `Timestamp`, `CalendarDay`, `Hour`, `Duration`, `MonthOfYear` |
| Coordinates | `Latitude`, `Longitude`, `Coordinates`                        |
| Hashes      | `MD5Hash`, `SHA256Hash`, `SHA512Hash`                         |
| Media       | `Media`                                                       |
| Collections | `UniqueObjectArray`                                           |

The package is framework-agnostic and can be used in any TypeScript domain layer regardless of the framework, ORM or persistence technology around it.

## Documentation

Full documentation:

https://haskou.github.io/value-objects/

API reference:

https://haskou.github.io/value-objects/reference/

## Development

```bash
git clone https://github.com/haskou/value-objects.git
cd value-objects

yarn install
yarn test
yarn build
```

## Contributing

Bug reports, feature requests and pull requests are welcome.

https://github.com/haskou/value-objects/issues

## License

MIT. See [LICENSE.txt](LICENSE.txt).

[![CI](https://github.com/haskou/value-objects/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/haskou/value-objects/actions/workflows/ci.yml?query=branch%3Amaster)
[![codecov](https://codecov.io/gh/haskou/value-objects/branch/master/graph/badge.svg)](https://codecov.io/gh/haskou/value-objects)
[![npm version](https://img.shields.io/npm/v/@haskou/value-objects.svg)](https://www.npmjs.com/package/@haskou/value-objects)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen?logo=renovatebot)](https://docs.renovatebot.com/)
[![license](https://img.shields.io/npm/l/@haskou/value-objects.svg)](LICENSE.txt)

## Documentation

Full documentation is available at **https://haskou.github.io/value-objects/**.

The documentation includes installation, quick start, examples, error handling, serialization notes, and one reference page per exported class.

Reusable agent instructions and engineering skills are available at **https://github.com/haskou/ddd-engineer-skills**.

# Value Objects

A TypeScript library for validated, immutable primitive wrappers and small utility value objects.

It provides ready-to-use objects for strings, numbers, identifiers, dates, coordinates, hashes, media, collections, and cryptographic payload helpers. Validation happens when an object is created, so code receiving one of these objects can rely on its shape.

## Installation

```bash
npm install @haskou/value-objects
```

```bash
yarn add @haskou/value-objects
```

## Quick start

```typescript
import { Color, Email, Hour, PositiveNumber } from '@haskou/value-objects';

const email = new Email('user@example.com');
const price = new PositiveNumber(29.99);
const color = new Color('#FF0000');
const hour = new Hour('09:30');

console.log(email.valueOf()); // 'user@example.com'
console.log(price.valueOf()); // 29.99
console.log(color.toString()); // '#FF0000'
console.log(hour.addMinutes(45).toString()); // '10:15'
```

Invalid values throw specific errors.

```typescript
import { Email, InvalidEmailError } from '@haskou/value-objects';

try {
  new Email('not-an-email');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    console.error('Invalid email');
  }
}
```

## Available categories

| Category | Examples |
| --- | --- |
| Base | `ValueObject`, `NullObject`, `Enum` |
| Strings | `StringValueObject`, `Password`, `Email`, `Color` |
| Numbers | `NumberValueObject`, `Integer`, `PositiveNumber` |
| IDs | `ShortId`, `UUID` |
| Time | `Timestamp`, `CalendarDay`, `Hour`, `Duration`, `MonthOfYear` |
| Coordinates | `Latitude`, `Longitude`, `Coordinates` |
| Hashes | `MD5Hash`, `SHA256Hash`, `SHA512Hash` |
| Media | `Media` |
| Collections | `UniqueObjectArray` |
| Crypto helpers | `KeyPair`, `PrivateKey`, `PublicKey`, `SymmetricKey`, encrypted payload objects |

See the complete API reference in the documentation: https://haskou.github.io/value-objects/reference/

## Documentation development

```bash
# Start local docs server
yarn docs:dev

# Build static documentation
yarn docs:build

# Preview the built site
yarn docs:preview
```

## Package development

```bash
yarn install
yarn test
yarn build
```

## Release branches

Publishing is handled by CI when a pull request is merged into the default branch.

| Branch prefix | npm bump |
| --- | --- |
| `fix/*` | Patch |
| `feat/*` | Minor |
| `break/*` | Major |

Branches without one of these prefixes still run CI, but they do not publish to npm.

## License

MIT. See [LICENSE.txt](LICENSE.txt).

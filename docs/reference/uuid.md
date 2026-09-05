---
title: UUID
description: UUID value object with random generation.
---

# `UUID`

UUID value object with random generation.

## Import

```typescript
import { UUID } from '@haskou/value-objects';
```

## Signature

```typescript
class UUID extends ValueObject<string>
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must use the standard `8-4-4-4-12` hexadecimal structure with a supported UUID version and RFC variant. The Nil and Max sentinel UUIDs defined by RFC 9562 are also accepted.

## Throws

This class can throw:

- `InvalidLengthError`
- `InvalidFormatError`

## Methods

| Method              | Description                       |
| ------------------- | --------------------------------- |
| `static generate()` | Generates a random UUID v4 value. |

## Example

```typescript
import { UUID } from '@haskou/value-objects';

const id = UUID.generate();
id.toString(); // e.g. '3fd4c04a-8e73-4e10-aef3-f491b32ec538'
```

## Notes

- The constructor pattern accepts lowercase `a-z`, `0-9`, and hyphens.

Generation uses the installed `uuid` dependency, which selects its Node or browser implementation. Consumers do not need to configure a global crypto object in Node. Browser bundlers select the browser entry automatically.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

---
title: Color
description: Validated hex color value object.
---

# `Color`

Validated hex color value object.

## Import

```typescript
import { Color } from '@haskou/value-objects';
```

## Signature

```typescript
class Color extends StringValueObject
```

## Constructor

```typescript
constructor(value: string | StringValueObject)
```

## Validation

Must be a 3-digit or 6-digit hex color with a leading `#`.

## Throws

This class can throw:

- `InvalidColorError`

## Methods

| Method | Description |
| --- | --- |
| `hasValue(other)` | Compares the underlying color value case-insensitively, including against primitive strings. |
| `isEqual(other)` | Requires another `Color` and compares the value case-insensitively. |

## Example

```typescript
import { Color } from '@haskou/value-objects';

const red = new Color('#ff0000');

red.isEqual(Color.RED); // true
red.hasValue('#FF0000'); // true
red.isEqual('#FF0000'); // false
Color.BLUE.valueOf(); // '#0000FF'
```

## Notes

- `isEqual()` keeps domain type as part of equality; use `hasValue()` when only the normalized color value matters.
- Predefined constants include red, green, blue, black, white, yellow, cyan, magenta, orange, purple, pink, and brown.

## Related

- [ValueObject equality](/reference/value-object)
- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

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
| `isEqual(other)` | Compares color values case-insensitively. |

## Example

```typescript
import { Color } from '@haskou/value-objects';

const red = new Color('#ff0000');

red.isEqual(Color.RED); // true
Color.BLUE.valueOf(); // '#0000FF'
```

## Notes

- Predefined constants include red, green, blue, black, white, yellow, cyan, magenta, orange, purple, pink, and brown.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

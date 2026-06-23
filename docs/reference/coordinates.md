---
title: Coordinates
description: Latitude and longitude pair represented as a string value.
---

# `Coordinates`

Latitude and longitude pair represented as a string value.

## Import

```typescript
import { Coordinates } from '@haskou/value-objects';
```

## Signature

```typescript
class Coordinates extends StringValueObject
```

## Constructor

```typescript
constructor(latitude: number | Latitude, longitude: number | Longitude)
```

## Validation

Latitude and longitude are validated through their own classes.

## Methods

| Method | Description |
| --- | --- |
| `static fromString(value)` | Parses `latitude,longitude` into a `Coordinates` instance. |
| `getLatitude()` | Returns a `Latitude` copy. |
| `getLongitude()` | Returns a `Longitude` copy. |

## Example

```typescript
import { Coordinates } from '@haskou/value-objects';

const coordinates = new Coordinates(41.3888, 2.159);

coordinates.toString(); // '41.3888,2.159'
coordinates.getLatitude().valueOf(); // 41.3888
```

## Notes

- `fromString()` uses `parseFloat()` on both comma-separated parts.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

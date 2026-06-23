---
title: UniqueObjectArray
description: Iterable collection that keeps comparable items unique.
---

# `UniqueObjectArray`

Iterable collection that keeps comparable items unique.

## Import

```typescript
import { UniqueObjectArray } from '@haskou/value-objects';
```

## Signature

```typescript
class UniqueObjectArray<T extends ComparableItem> implements Iterable<T>
```

## Constructor

```typescript
constructor()
```

## Validation

Uniqueness is based on each item's `isEqual()` method.

## Methods

| Method | Description |
| --- | --- |
| `static fromArray(array)` | Builds a unique collection from an array. |
| `includes(item)` | Returns true when an equal item exists. |
| `push(item)` | Adds the item when no equal item exists. Returns true when inserted. |
| `remove(item)` | Removes the equal item. Returns true when removed. |
| `length()` | Returns the number of stored items. |
| `toArray()` | Returns a shallow array copy. |
| `[Symbol.iterator]()` | Iterates over stored items. |

## Example

```typescript
import { DayOfWeek, UniqueObjectArray } from '@haskou/value-objects';

const days = UniqueObjectArray.fromArray([
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.MONDAY,
]);

days.length(); // 2
[...days].map((day) => day.toString()); // ['monday', 'tuesday']
```

## Notes

- Items must implement `isEqual(item: unknown): boolean`.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

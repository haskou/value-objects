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
constructor(items?: Iterable<T>)
```

Duplicates in `items` are dropped, keeping the first occurrence.

## Immutability

The collection is immutable. `push()`, `remove()` and `filter()` return a new `UniqueObjectArray` and never modify the original.

## Migrating from the mutable API

| Before | Now |
| --- | --- |
| `array.length()` | `array.length` |
| `array.push(item);` mutated and returned a boolean | `array = array.push(item);` returns a new collection |
| `array.remove(item);` mutated | `array = array.remove(item);` returns a new collection |

## Validation

Uniqueness is decided by each item's `isEqual()` method. Items are indexed by `constructor.name` plus `valueOf()`, so `includes()` only calls `isEqual()` on items sharing that key instead of scanning the whole collection.

## Methods

| Method                                 | Description                                                         |
| -------------------------------------- | ------------------------------------------------------------------- |
| `static fromArray(items)`              | Builds a unique collection from an iterable.                        |
| `length`                               | Getter with the number of stored items.                             |
| `includes(item)`                       | Returns true when an equal item exists.                             |
| `push(...items)`                       | Returns a new collection with the items added, ignoring equal ones. |
| `remove(item)`                         | Returns a new collection without the equal item.                    |
| `isEmpty()`                            | True when there are no items.                                       |
| `at(index)`                            | Returns the item at the index; negative indexes count from the end. |
| `find(predicate)`                      | Returns the first matching item or `undefined`.                     |
| `filter(predicate)`                    | Returns a new collection with the matching items.                   |
| `map(callback)`                        | Returns a plain array with the mapped values.                       |
| `some(predicate)` / `every(predicate)` | Array-style checks.                                                 |
| `forEach(callback)`                    | Iterates in insertion order.                                        |
| `reduce(callback, initialValue)`       | Reduces to a single value.                                          |
| `toArray()`                            | Returns a shallow array copy.                                       |
| `[Symbol.iterator]()`                  | Iterates over stored items.                                         |

## Example

```typescript
import { DayOfWeek, UniqueObjectArray } from '@haskou/value-objects';

const days = UniqueObjectArray.fromArray([
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.MONDAY,
]);

days.length; // 2
const withFriday = days.push(DayOfWeek.FRIDAY); // new instance
days.length; // still 2
```

## Notes

- Items must implement `isEqual(item: unknown): boolean`.
- Items that are equal must also share the same class name and `valueOf()` result.

## Related

- [Error handling](/guides/error-handling)
- [Reference overview](/reference/)

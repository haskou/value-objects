---
title: Basic usage
description: Basic usage examples for @haskou/value-objects
---

# Basic usage

## Create values

```typescript
import { Color, Email, Hour, PositiveNumber } from '@haskou/value-objects';

const email = new Email('user@example.com');
const color = new Color('#FF0000');
const startAt = new Hour('09:30');
const quantity = new PositiveNumber(3);
```

## Read primitive values

```typescript
email.valueOf(); // 'user@example.com'
email.toString(); // 'user@example.com'
quantity.valueOf(); // 3
```

## Compare by value

```typescript
const a = new Email('user@example.com');
const b = new Email('user@example.com');

a === b; // false
a.isEqual(b); // true
```

## Use helpers

```typescript
const nextSlot = new Hour('23:30').addMinutes(90);
nextSlot.toString(); // '01:00'

const id = UUID.generate();
id.toString();
```

## Handle invalid input

```typescript
import { Email, InvalidEmailError } from '@haskou/value-objects';

try {
  new Email('nope');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    // Handle invalid email input.
  }
}
```

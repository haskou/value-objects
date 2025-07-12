# Technical Documentation

Comprehensive technical documentation for the Value Objects library.

## 📋 Table of Contents

- [API Documentation](#api-documentation)
  - [Base Classes](#base-classes)
  - [String Value Objects](#string-value-objects)
  - [Number Value Objects](#number-value-objects)
  - [Integer Value Objects](#integer-value-objects)
  - [PositiveNumber Value Objects](#positivenumber-value-objects)
  - [Year Value Objects](#year-value-objects)
  - [Color Value Objects](#color-value-objects)
  - [Email Value Objects](#email-value-objects)
  - [Hour Value Objects](#hour-value-objects)
  - [Time Value Objects](#time-value-objects)
  - [Enum Value Objects](#enum-value-objects)
- [Error Handling](#error-handling)
- [Design Principles](#design-principles)

## 📚 API Documentation

### Base Classes

#### ValueObject\<T>

The abstract base class for all value objects.

```typescript
abstract class ValueObject<T extends Primitive = Primitive> {
  constructor(protected readonly value: T);

  public isEqual(other: unknown): boolean;
  public valueOf(): T;
  public toString(): string;
  protected clone(value: T): this;
}
```

**Methods:**
- `valueOf()`: Returns the primitive value
- `toString()`: Returns string representation
- `isEqual(other)`: Compares equality with another value
- `clone(value)`: Creates a new instance with the given value

### String Value Objects

#### StringValueObject

Represents immutable string values with length validation.

```typescript
class StringValueObject extends ValueObject<string> {
  constructor(value: string | StringValueObject, maxLength?: number);

  public toString(): string;
  public isEmpty(): boolean;
}
```

**Example:**
```typescript
// Basic usage
const username = new StringValueObject('alice123');

// With length limit
const shortCode = new StringValueObject('ABC', 3);

// From another StringValueObject
const copy = new StringValueObject(username);

// Validation
try {
  new StringValueObject('a'.repeat(600)); // Throws InvalidStringLengthError
} catch (error) {
  console.error('String too long');
}
```

### Number Value Objects

#### NumberValueObject

Represents immutable numeric values with arithmetic operations.

```typescript
class NumberValueObject extends ValueObject<number> {
  constructor(value: number | NumberValueObject);

  // Comparison methods
  public isZero(): boolean;
  public isGreaterThan(other: number | NumberValueObject): boolean;
  public isGreaterOrEqualThan(other: number | NumberValueObject): boolean;
  public isLessThan(other: number | NumberValueObject): boolean;
  public isLessOrEqualThan(other: number | NumberValueObject): boolean;

  // Arithmetic operations
  public add(other: number | NumberValueObject): NumberValueObject;
  public subtract(other: number | NumberValueObject): NumberValueObject;
  public multiply(other: number | NumberValueObject): NumberValueObject;
  public divide(other: number | NumberValueObject): NumberValueObject;
}
```

**Example:**
```typescript
const a = new NumberValueObject(10);
const b = new NumberValueObject(5);

// Arithmetic operations (immutable)
const sum = a.add(b);        // 15
const diff = a.subtract(b);  // 5
const prod = a.multiply(b);  // 50
const quot = a.divide(b);    // 2

// Comparisons
console.log(a.isGreaterThan(b));     // true
console.log(b.isLessThan(a));        // true
console.log(a.isEqual(10));          // true

// Works with primitive numbers
const result = a.add(3);     // 13

// Original values remain unchanged
console.log(a.valueOf());    // 10 (unchanged)
console.log(b.valueOf());    // 5 (unchanged)
```

### Integer Value Objects

#### Integer

Represents immutable integer values (whole numbers) with all arithmetic operations inherited from NumberValueObject.

```typescript
class Integer extends NumberValueObject {
  constructor(value: number | NumberValueObject);

  // Inherits all NumberValueObject methods:
  // Comparison methods
  public isZero(): boolean;
  public isGreaterThan(other: number | NumberValueObject): boolean;
  public isGreaterOrEqualThan(other: number | NumberValueObject): boolean;
  public isLessThan(other: number | NumberValueObject): boolean;
  public isLessOrEqualThan(other: number | NumberValueObject): boolean;

  // Arithmetic operations
  public add(other: number | NumberValueObject): NumberValueObject;
  public subtract(other: number | NumberValueObject): NumberValueObject;
  public multiply(other: number | NumberValueObject): NumberValueObject;
  public divide(other: number | NumberValueObject): NumberValueObject;
}
```

**Example:**
```typescript
// Valid integers
const count = new Integer(42);
const negative = new Integer(-10);
const zero = new Integer(0);

// Arithmetic operations (inherited from NumberValueObject)
const sum = count.add(negative);         // 32
const product = count.multiply(2);       // 84
const quotient = count.divide(2);        // 21

// Comparisons
console.log(count.isGreaterThan(zero));  // true
console.log(negative.isLessThan(zero));  // true
console.log(zero.isZero());              // true

// From another NumberValueObject
const numberValue = new NumberValueObject(15);
const integerFromNumber = new Integer(numberValue);
console.log(integerFromNumber.valueOf()); // 15

// String representation
console.log(count.toString());           // '42'
console.log(negative.valueOf());         // -10

// Note: Arithmetic operations return NumberValueObject, not Integer
// This is because operations might result in non-integer values
const division = count.divide(3);        // Returns NumberValueObject with value 14

// Validation
try {
  new Integer(42.5);                     // Throws InvalidIntegerError
  new Integer(3.14159);                  // Throws InvalidIntegerError
  new Integer(Infinity);                 // Throws InvalidIntegerError
  new Integer(-Infinity);                // Throws InvalidIntegerError
  new Integer(NaN);                      // Throws InvalidNumberError
} catch (error) {
  console.error('Value must be a valid integer');
}

// Works with large integers
const large = new Integer(1000000);      // Valid
const veryLarge = new Integer(-999999);  // Valid
```

### PositiveNumber Value Objects

#### PositiveNumber

Represents immutable positive numeric values (greater than 0) with all arithmetic operations inherited from NumberValueObject.

```typescript
class PositiveNumber extends NumberValueObject {
  constructor(value: number | NumberValueObject);

  // Inherits all NumberValueObject methods:
  // Comparison methods
  public isZero(): boolean;                    // Always returns false
  public isGreaterThan(other: number | NumberValueObject): boolean;
  public isGreaterOrEqualThan(other: number | NumberValueObject): boolean;
  public isLessThan(other: number | NumberValueObject): boolean;
  public isLessOrEqualThan(other: number | NumberValueObject): boolean;

  // Arithmetic operations
  public add(other: number | NumberValueObject): NumberValueObject;
  public subtract(other: number | NumberValueObject): NumberValueObject;
  public multiply(other: number | NumberValueObject): NumberValueObject;
  public divide(other: number | NumberValueObject): NumberValueObject;
}
```

**Example:**
```typescript
// Valid positive numbers
const quantity = new PositiveNumber(5);
const price = new PositiveNumber(19.99);
const percentage = new PositiveNumber(0.15);

// Arithmetic operations (inherited from NumberValueObject)
const total = quantity.multiply(price);      // 99.95
const increased = price.add(10);             // 29.99
const half = quantity.divide(2);             // 2.5

// Comparisons
console.log(price.isGreaterThan(quantity));  // true
console.log(quantity.isLessThan(price));     // true
console.log(quantity.isZero());              // false (always false for PositiveNumber)

// From another PositiveNumber
const copy = new PositiveNumber(quantity);
console.log(copy.valueOf());                 // 5

// String representation
console.log(quantity.toString());            // '5'
console.log(price.valueOf());               // 19.99

// Note: Arithmetic operations return NumberValueObject, not PositiveNumber
// This is because operations might result in non-positive values
const result = quantity.subtract(10);        // Returns NumberValueObject with value -5

// Validation
try {
  new PositiveNumber(0);                     // Throws InvalidPositiveNumberError
  new PositiveNumber(-5);                    // Throws InvalidPositiveNumberError
  new PositiveNumber(-0.1);                  // Throws InvalidPositiveNumberError
} catch (error) {
  console.error('Value must be greater than 0');
}

// Works with decimals
const decimal = new PositiveNumber(0.001);   // Valid
const large = new PositiveNumber(1000000);   // Valid
```

### Year Value Objects

#### Year

Represents immutable year values with leap year calculations and date utilities. Inherits all functionality from Integer.

```typescript
class Year extends Integer {
  constructor(value: number | NumberValueObject);

  // Year-specific methods
  public isLeapYear(): boolean;
  public getNumberOfDays(): number;

  // Inherits all Integer and NumberValueObject methods:
  // Comparison methods
  public isZero(): boolean;
  public isGreaterThan(other: number | NumberValueObject): boolean;
  public isGreaterOrEqualThan(other: number | NumberValueObject): boolean;
  public isLessThan(other: number | NumberValueObject): boolean;
  public isLessOrEqualThan(other: number | NumberValueObject): boolean;

  // Arithmetic operations
  public add(other: number | NumberValueObject): NumberValueObject;
  public subtract(other: number | NumberValueObject): NumberValueObject;
  public multiply(other: number | NumberValueObject): NumberValueObject;
  public divide(other: number | NumberValueObject): NumberValueObject;
}
```

**Example:**
```typescript
// Valid years
const currentYear = new Year(2024);
const pastYear = new Year(1900);
const futureYear = new Year(2100);
const year2000 = new Year(2000);

// Leap year calculations
console.log(currentYear.isLeapYear());   // true (2024 is divisible by 4)
console.log(pastYear.isLeapYear());      // false (1900 is divisible by 100 but not 400)
console.log(futureYear.isLeapYear());    // false (2100 is divisible by 100 but not 400)
console.log(year2000.isLeapYear());      // true (2000 is divisible by 400)

// Number of days in year
console.log(currentYear.getNumberOfDays()); // 366 (leap year)
console.log(pastYear.getNumberOfDays());    // 365 (regular year)
console.log(year2000.getNumberOfDays());    // 366 (leap year)

// Arithmetic operations (inherited from NumberValueObject)
const nextYear = currentYear.add(1);     // 2025 (as NumberValueObject)
const decade = currentYear.subtract(10); // 2014 (as NumberValueObject)

// Comparisons
console.log(currentYear.isGreaterThan(pastYear));    // true
console.log(pastYear.isLessThan(futureYear));        // true
console.log(currentYear.isEqual(2024));              // true

// From another NumberValueObject or Integer
const yearFromNumber = new NumberValueObject(2023);
const year = new Year(yearFromNumber);
console.log(year.valueOf());             // 2023
console.log(year.isLeapYear());          // false

// String representation
console.log(currentYear.toString());     // '2024'
console.log(pastYear.valueOf());         // 1900

// Common leap year patterns
const leapYears = [2020, 2024, 2028, 2032].map(y => new Year(y));
const regularYears = [2021, 2022, 2023, 2025].map(y => new Year(y));

leapYears.forEach(year => {
  console.log(`${year.valueOf()}: ${year.getNumberOfDays()} days`); // All show 366
});

regularYears.forEach(year => {
  console.log(`${year.valueOf()}: ${year.getNumberOfDays()} days`); // All show 365
});

// Validation (inherits Integer validation)
try {
  new Year(2024.5);                      // Throws InvalidIntegerError
  new Year(NaN);                         // Throws InvalidNumberError
  new Year(Infinity);                    // Throws InvalidIntegerError
} catch (error) {
  console.error('Year must be a valid integer');
}

// Works with negative years (BCE)
const ancientYear = new Year(-500);     // 500 BCE
console.log(ancientYear.valueOf());     // -500
console.log(ancientYear.isLeapYear());  // false (year -500 is not a leap year)
```

### Color Value Objects

#### Color

Represents immutable hex color values with predefined colors.

```typescript
class Color extends StringValueObject {
  constructor(value: string | StringValueObject);

  public isEqual(other: Color): boolean; // Case-insensitive comparison

  // Predefined static colors
  static readonly RED: Color;
  static readonly GREEN: Color;
  static readonly BLUE: Color;
  static readonly BLACK: Color;
  static readonly WHITE: Color;
  static readonly YELLOW: Color;
  static readonly CYAN: Color;
  static readonly MAGENTA: Color;
  static readonly ORANGE: Color;
  static readonly PURPLE: Color;
  static readonly PINK: Color;
  static readonly BROWN: Color;
}
```

**Example:**
```typescript
// Valid hex colors
const red = new Color('#FF0000');
const blue = new Color('#00F');
const green = Color.GREEN;

// Case-insensitive comparison
const color1 = new Color('#ff0000');
const color2 = new Color('#FF0000');
console.log(color1.isEqual(color2)); // true

// From StringValueObject
const colorString = new StringValueObject('#ABCDEF');
const color = new Color(colorString);

// Validation
try {
  new Color('invalid-color'); // Throws InvalidColorError
} catch (error) {
  console.error('Invalid hex color format');
}
```

### Email Value Objects

#### Email

Represents immutable email addresses with comprehensive validation.

```typescript
class Email extends StringValueObject {
  constructor(value: string | StringValueObject);
}
```

**Example:**
```typescript
// Valid email addresses
const userEmail = new Email('user@example.com');
const workEmail = new Email('john.doe@company.org');
const taggedEmail = new Email('user+newsletter@domain.co.uk');

// From StringValueObject
const emailString = new StringValueObject('admin@system.net');
const email = new Email(emailString);

// String representation
console.log(userEmail.toString());           // 'user@example.com'
console.log(userEmail.valueOf());            // 'user@example.com'

// Equality comparison
const email1 = new Email('test@example.com');
const email2 = new Email('test@example.com');
console.log(email1.isEqual(email2));         // true
console.log(email1.isEqual('test@example.com')); // true

// Inherits all StringValueObject methods
console.log(userEmail.isEmpty());            // false

// Validation examples
try {
  new Email('invalid-email');                // Throws InvalidEmailError
  new Email('user@');                        // Throws InvalidEmailError
  new Email('user@domain');                  // Throws InvalidEmailError
  new Email('user@@domain.com');             // Throws InvalidEmailError
} catch (error) {
  console.error('Invalid email format');
}

// Supports various valid formats
const validEmails = [
  'simple@example.com',
  'user.name@domain.org',
  'user+tag@example.co.uk',
  'first.last@subdomain.company.travel',
  'admin123@my-domain.museum'
];
```

### Hour Value Objects

#### Hour

Represents immutable time values in 24-hour format with time arithmetic operations.

```typescript
class Hour extends StringValueObject {
  constructor(value: string);                    // "HH:MM" format
  constructor(value: number, minutes?: number);  // Separate hours and minutes

  // Time arithmetic
  public addMinutes(minutes: number): Hour;
  public diffInMinutes(other: Hour): number;

  // Getters
  public getHours(): number;
  public getMinutes(): number;

  // Comparisons
  public isGreaterThan(hour: Hour): boolean;
  public isLessThan(hour: Hour): boolean;
}
```

**Example:**
```typescript
// Different constructor options
const morning = new Hour('09:30');           // String format
const afternoon = new Hour(14, 45);          // Separate values
const evening = new Hour(20, 0);             // 20:00

// Time arithmetic
const laterTime = morning.addMinutes(90);    // 11:00
const duration = morning.diffInMinutes(afternoon); // 315 minutes

// Getters
console.log(morning.getHours());             // 9
console.log(morning.getMinutes());           // 30

// Comparisons
console.log(afternoon.isGreaterThan(morning)); // true
console.log(morning.isLessThan(evening));       // true

// String representation
console.log(morning.toString());             // '09:30'

// Handles day overflow
const lateNight = new Hour('23:30');
const nextDay = lateNight.addMinutes(60);    // '00:30' (next day)

// Validation
try {
  new Hour('25:00');   // Throws InvalidHourError
  new Hour(12, 65);    // Throws InvalidMinutesError
} catch (error) {
  console.error('Invalid time format');
}
```

### Time Value Objects

#### CalendarDay

Represents immutable calendar day values with date utilities.

```typescript
class CalendarDay {
  constructor(value?: string | Date | number | Timestamp);

  public static fromTimestamp(timestamp: Timestamp): CalendarDay;
  public static fromString(value: string): CalendarDay;

  public toString(): string;
  public getDayOfWeek(): DayOfWeek;
  public isBefore(other: CalendarDay): boolean;
  public isAfter(other: CalendarDay): boolean;
  public diffInDays(other: CalendarDay): number;
}
```

#### Day

Represents immutable day values (1-31) with validation.

```typescript
class Day extends Integer {
  constructor(value: number | NumberValueObject);
}
```

#### DayOfWeek

Represents immutable day of week enumeration.

```typescript
enum EDaysOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

class DayOfWeek extends Enum {
  protected getValues() {
    return Object.values(EDaysOfWeek);
  }
}
```

#### Duration

Represents immutable duration values in milliseconds.

```typescript
class Duration extends NumberValueObject {
  constructor(value: number | NumberValueObject);

  public static fromHours(hours: number): Duration;
  public static fromMinutes(minutes: number): Duration;
  public static fromSeconds(seconds: number): Duration;

  public toHours(): number;
  public toMinutes(): number;
  public toSeconds(): number;
}
```

#### Month

Represents immutable month enumeration (1-12).

```typescript
class Month extends Enum {
  protected getValues() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }
}
```

#### MonthOfYear

Represents immutable month/year combination.

```typescript
class MonthOfYear extends ValueObject<string> {
  constructor(month: number | Month, year: number | Year);

  public static fromTimestamp(timestamp: Timestamp): MonthOfYear;
  public static fromString(value: string): MonthOfYear;

  public getMonth(): Month;
  public getYear(): Year;
  public toString(): string; // Format: "YYYY/MM"
}
```

#### Timestamp

Represents immutable timestamp values with comprehensive date/time operations.

```typescript
class Timestamp extends ValueObject<number> {
  constructor(value: number | Date | Timestamp | string);

  // Static factory methods
  public static now(): Timestamp;
  public static fromDate(date: Date): Timestamp;

  // Getters
  public getYear(): Year;
  public getMonth(): Month;
  public getDay(): Day;
  public getHours(): number;
  public getMinutes(): number;
  public getSeconds(): number;
  public getDayOfWeek(): DayOfWeek;

  // Arithmetic operations
  public addDays(days: number): Timestamp;
  public addHours(hours: number): Timestamp;
  public addMinutes(minutes: number): Timestamp;
  public addSeconds(seconds: number): Timestamp;

  // Comparisons
  public isBefore(other: Timestamp): boolean;
  public isAfter(other: Timestamp): boolean;
  public diffInDays(other: Timestamp): number;
  public diffInHours(other: Timestamp): number;
  public diffInMinutes(other: Timestamp): number;

  // Conversions
  public toDate(): Date;
  public toISOString(): string;
}
```

#### TimestampInterval

Represents immutable time intervals with start and end timestamps.

```typescript
class TimestampInterval extends ValueObject<string> {
  constructor(start: Timestamp, end: Timestamp);

  public static fromPrimitives(primitives: PrimitiveOf<TimestampInterval>): TimestampInterval;

  public getStart(): Timestamp;
  public getEnd(): Timestamp;
  public getDuration(): Duration;
  public contains(timestamp: Timestamp): boolean;
  public overlaps(other: TimestampInterval): boolean;
  public split(parts: number): TimestampInterval[];
}
```

### Enum Value Objects

#### Enum

An abstract base class for creating type-safe enumeration value objects.

```typescript
abstract class Enum<T extends Primitive = Primitive> extends ValueObject<T> {
  constructor(protected readonly value: T);

  public abstract getValues(): T[];
}
```

**Features:**
- Type-safe enumeration validation
- Inheritance from ValueObject
- Static factory methods support
- Immutable enum values
- Comprehensive error handling

**Usage:**

```typescript
import { Enum } from 'value-objects';

// Define your enum
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

// Create enum value object classes
class UserStatusEnum extends Enum {
  public getValues() {
    return Object.values(UserStatus);
  }

  // Static factory methods for convenience
  static ACTIVE = () => new UserStatusEnum(UserStatus.ACTIVE);
  static INACTIVE = () => new UserStatusEnum(UserStatus.INACTIVE);
  static PENDING = () => new UserStatusEnum(UserStatus.PENDING);
  static SUSPENDED = () => new UserStatusEnum(UserStatus.SUSPENDED);
}

class PriorityEnum extends Enum {
  public getValues() {
    return Object.values(Priority);
  }

  static LOW = () => new PriorityEnum(Priority.LOW);
  static MEDIUM = () => new PriorityEnum(Priority.MEDIUM);
  static HIGH = () => new PriorityEnum(Priority.HIGH);
  static URGENT = () => new PriorityEnum(Priority.URGENT);
}

// Usage examples
const status = UserStatusEnum.ACTIVE();
const priority = new PriorityEnum(Priority.HIGH);

console.log(status.toString());              // 'active'
console.log(priority.valueOf());             // 3
console.log(status.isEqual('active'));       // true
console.log(priority.isEqual(3));            // true

// Comparison
const status1 = UserStatusEnum.ACTIVE();
const status2 = new UserStatusEnum('active');
console.log(status1.isEqual(status2));       // true

// Clone
const statusCopy = (status as any).clone();
console.log(statusCopy.toString());          // 'active'

// Validation
try {
  new UserStatusEnum('invalid');      // Throws ValueNotInEnumError
  new PriorityEnum(999);              // Throws ValueNotInEnumError
} catch (error) {
  console.error('Invalid enum value');
}

// Mixed type enums
enum MixedEnum {
  STRING_VALUE = 'text',
  NUMBER_VALUE = 42
}

class MixedEnumValueObject extends Enum {
  public getValues() {
    return Object.values(MixedEnum);
  }
}

const mixedString = new MixedEnumValueObject('text');  // Valid
const mixedNumber = new MixedEnumValueObject(42);      // Valid
```

## 🚨 Error Handling

The library provides specific error types for different validation failures:

```typescript
import {
  InvalidStringLengthError,
  InvalidNumberError,
  InvalidIntegerError,
  InvalidColorError,
  InvalidHourError,
  InvalidMinutesError,
  InvalidEmailError,
  InvalidPositiveNumberError,
  ValueNotInEnumError,
  InvalidDayError,
  InvalidDayFormatError,
  InvalidTimestampIntervalError,
  NullObjectError
} from 'value-objects';

// String length validation
try {
  new StringValueObject('too long string', 5);
} catch (error) {
  if (error instanceof InvalidStringLengthError) {
    console.error('String exceeds maximum length');
  }
}

// Number validation
try {
  new NumberValueObject(NaN);
} catch (error) {
  if (error instanceof InvalidNumberError) {
    console.error('Invalid number provided');
  }
}

// Integer validation
try {
  new Integer(42.5);
} catch (error) {
  if (error instanceof InvalidIntegerError) {
    console.error('Value must be a whole number');
  }
}

try {
  new Integer(Infinity);
} catch (error) {
  if (error instanceof InvalidIntegerError) {
    console.error('Infinity is not a valid integer');
  }
}

// Color validation
try {
  new Color('not-a-color');
} catch (error) {
  if (error instanceof InvalidColorError) {
    console.error('Invalid hex color format');
  }
}

// Time validation
try {
  new Hour('25:30'); // Invalid hour
} catch (error) {
  if (error instanceof InvalidHourError) {
    console.error('Hour must be between 0-23');
  }
}

try {
  new Hour(12, 75); // Invalid minutes
} catch (error) {
  if (error instanceof InvalidMinutesError) {
    console.error('Minutes must be between 0-59');
  }
}

// Day validation
try {
  new Day(32); // Invalid day
} catch (error) {
  if (error instanceof InvalidDayError) {
    console.error('Day must be between 1-31');
  }
}

// Calendar day format validation
try {
  new CalendarDay('invalid-date-format');
} catch (error) {
  if (error instanceof InvalidDayFormatError) {
    console.error('Invalid date format provided');
  }
}

// Email validation
try {
  new Email('invalid-email-format');
} catch (error) {
  if (error instanceof InvalidEmailError) {
    console.error('Invalid email format provided');
  }
}

try {
  new Email('user@domain.c'); // Domain extension too short
} catch (error) {
  if (error instanceof InvalidEmailError) {
    console.error('Email domain extension must be 2-13 characters');
  }
}

// PositiveNumber validation
try {
  new PositiveNumber(-5);
} catch (error) {
  if (error instanceof InvalidPositiveNumberError) {
    console.error('Value must be greater than 0');
  }
}

try {
  new PositiveNumber(0); // Zero is not positive
} catch (error) {
  if (error instanceof InvalidPositiveNumberError) {
    console.error('Zero is not a positive number');
  }
}

// Enum validation
try {
  new UserStatusEnum('invalid-status');
} catch (error) {
  if (error instanceof ValueNotInEnumError) {
    console.error('Value not found in enum: active,inactive,pending,suspended');
  }
}

try {
  new PriorityEnum(999); // Invalid number enum
} catch (error) {
  if (error instanceof ValueNotInEnumError) {
    console.error('Enum value must be one of: 1,2,3,4');
  }
}

// Timestamp interval validation
try {
  const start = new Timestamp(Date.now() + 1000);
  const end = new Timestamp(Date.now());
  new TimestampInterval(start, end); // Start after end
} catch (error) {
  if (error instanceof InvalidTimestampIntervalError) {
    console.error('Start timestamp must be before end timestamp');
  }
}

// Null object error
try {
  const nullValue = new StringValueObject(null);
  nullValue.isEmpty(); // Throws NullObjectError
} catch (error) {
  if (error instanceof NullObjectError) {
    console.error('Cannot call method on null object');
  }
}
```

## 🎯 Design Principles

### Immutability

All value objects are immutable. Operations that appear to modify values actually return new instances:

```typescript
const original = new NumberValueObject(10);
const modified = original.add(5);

console.log(original.valueOf()); // 10 (unchanged)
console.log(modified.valueOf()); // 15 (new instance)
```

### Value Equality

Value objects are compared by their values, not by reference:

```typescript
const a = new StringValueObject('hello');
const b = new StringValueObject('hello');

console.log(a === b);        // false (different instances)
console.log(a.isEqual(b));   // true (same value)
```

### Null Safety

The library properly handles null and undefined values using the Null Object pattern:

```typescript
const nullValue = new StringValueObject(undefined);
console.log(NullObject.isNullObject(nullValue)); // true
```

If you try to call any method from a NullObject it will throw
a NullObjectError:

```typescript
// NullObject StringValue instance
const nullValue = new StringValueObject(undefined);
nullValue.isEmpty(); // Throw NullObjectError!
```

This prevents defensive programming and if-else validations

```typescript
// Without NullObject Pattern
let valueObject: StringValueObject;
if (value) {
  valueObject = new StringValueObject(value);
}
else {
  throw Error('Invalid value');
}
return valueObject.isEmpty();

// With NullObject pattern
valueObject = new StringValueObject(value);
return valueObject.isEmpty();
```

### Type Safety

The library provides full TypeScript support with strict typing to prevent runtime errors:

```typescript
// Compile-time type checking
const amount: NumberValueObject = new NumberValueObject(100);
const price: PositiveNumber = new PositiveNumber(29.99);

// Type inference works correctly
const total = amount.add(price); // Type: NumberValueObject
const isExpensive = price.isGreaterThan(50); // Type: boolean
```

### Validation by Construction

All validation happens during object construction, ensuring that invalid states are impossible:

```typescript
// These will throw errors immediately
new Email('invalid-email');     // InvalidEmailError
new PositiveNumber(-1);        // InvalidPositiveNumberError
new Integer(3.14);             // InvalidIntegerError
new Color('not-a-color');      // InvalidColorError
```

### Composition over Inheritance

Value objects can be composed together to create more complex domain models:

```typescript
class Product {
  constructor(
    private readonly name: StringValueObject,
    private readonly price: PositiveNumber,
    private readonly category: CategoryEnum
  ) {}

  public getName(): StringValueObject {
    return this.name;
  }

  public getPrice(): PositiveNumber {
    return this.price;
  }

  public getCategory(): CategoryEnum {
    return this.category;
  }
}

const product = new Product(
  new StringValueObject('Laptop'),
  new PositiveNumber(999.99),
  CategoryEnum.ELECTRONICS()
);
```

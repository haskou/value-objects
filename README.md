# Value Objects

A TypeScript dependency-less library for creating safe, immutable,
and validated **Value Objects**. Perfect for applications that require **Domain-Driven Design (DDD)** and **type safety**.

## 🚀 Quick Start

```bash
npm install value-objects
```

```typescript
import { Email, PositiveNumber, Color, Hour } from 'value-objects';

// ✅ Automatic validation on construction
const email = new Email('user@example.com');     // Valid
const price = new PositiveNumber(29.99);         // Valid
const color = new Color('#FF0000');              // Valid
const hour = new Hour('09:30');                  // Valid

// ❌ Immediate errors with invalid values
const badEmail = new Email('not-an-email');      // Error!
const badPrice = new PositiveNumber(-5);         // Error!
```

## 🤔 Why use Value Objects?

**Without Value Objects:**
```typescript
function createUser(email: string, age: number): void {
  // Are they valid? We don't know until runtime
  if (!email.includes('@')) throw new Error('Invalid email');
  if (age <= 0) throw new Error('Invalid age');
  // Creation stuff
}
```

**With Value Objects:**
```typescript
function createUser(email: Email, age: PositiveNumber): void {
  // If we get here, values ARE valid
  // Creation stuff
}
```

This prevents defensive programming and if-else validations
since it implements Null Object pattern (see technical documentation).
Also value-objects can be modified easily keeping the same logic along
your application.

## 📦 Available Value Objects

### 🔤 Basic
- **`StringValueObject`** - Strings with length validation
- **`NumberValueObject`** - Numbers with math operations
- **`Integer`** - Whole numbers
- **`PositiveNumber`** - Positive numbers (> 0)

### ✨ Specialized
- **`Email`** - Email addresses with automatic validation
- **`Color`** - Hex colors (#FF0000)

### 🕒 Time
- **`Hour`** - Time in 24h format (09:30)
- **`Year`** - Years with leap year calculations
- **`CalendarDay`** - Calendar days
- **`Day`** - Days of month (1-31)
- **`DayOfWeek`** - Days of the week
- **`Month`** - Months (1-12)
- **`MonthOfYear`** - Month/year combinations
- **`Timestamp`** - Timestamps with operations
- **`TimestampInterval`** - Time intervals
- **`Duration`** - Duration in milliseconds

### 🌍 Coordinates
- **`Latitude`** - Latitude (-90 to 90)
- **`Longitude`** - Longitude (-180 to 180)
- **`Coordinates`** - Coordinate pairs

### 📝 Other
- **`Enum`** - Base class for typed enumerations

## 💡 Basic Examples

```typescript
// Validated strings
const name = new StringValueObject('John Doe');
const code = new StringValueObject('ABC', 3); // max 3 characters

// Numbers with operations
const price = new NumberValueObject(29.99);
const discount = new NumberValueObject(5.00);
const total = price.subtract(discount); // 24.99

// Emails
const email = new Email('user@example.com');
console.log(email.getDomain()); // 'example.com'

// Colors
const red = new Color('#FF0000');
const blue = Color.BLUE; // Predefined color

// Coordinates
const latitude = new Latitude(40.7128);   // New York
const longitude = new Longitude(-74.0060);
const coords = new Coordinates(latitude, longitude);

// Time
const hour = new Hour('09:30');
const year = new Year(2024);
console.log(year.isLeapYear()); // true
```

## 📚 Technical Documentation

Need more details? Check the complete documentation:

**[📖 TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)**

Includes:
- ✅ Complete API for all Value Objects
- ✅ Advanced usage examples
- ✅ Error handling
- ✅ Design principles (immutability, null safety, etc.)
- ✅ Composition and extensibility patterns

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b my-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ and TypeScript**

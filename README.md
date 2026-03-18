[![npm version](https://badge.fury.io/js/@haskou%2Fvalue-objects.svg)](https://badge.fury.io/js/@haskou%2Fvalue-objects)

# Value Objects

A TypeScript lightweight library for creating safe, immutable,
and validated **Value Objects**. Perfect for applications that require **Domain-Driven Design (DDD)** and **type safety**.

## 🚀 Quick Start

```bash
npm install @haskou/value-objects
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

### 🆔 Identifiers
- **`ShortId`** - MongoDB ObjectId strings (24‑character hex)
- **`UUID`** - Universally Unique Identifier (v4)

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

### 🔐 Cryptography
- **`KeyPair`** - Ed25519 key pair generation, signing, and verification
- **`PrivateKey`** - Ed25519 private key (PEM format) with signing
- **`PublicKey`** - Ed25519 public key (PEM format) with signature verification
- **`Signature`** - Base64-encoded ed25519 digital signature
- **`EncryptedPrivateKey`** - AES-256-GCM encrypted private key (password-based)
- **`EncryptedKeyPair`** - Key pair with encrypted private key

### 📎 Media
- **`Media`** - Binary/string content with Buffer, size, and Base64 helpers

### #️ Hashes
- **`MD5Hash`** - MD5 hashes with helpers
- **`SHA256Hash`** - SHA‑256 hashes with helpers
- **`SHA512Hash`** - SHA‑512 hashes with helpers

### 📝 Other
- **`Enum`** - Base class for typed enumerations
- **`UniqueObjectArray`** - Iterable collection that keeps comparable items unique

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

// IDs
const id = ShortId.generate(); // 69ad70897364ee0d1406b1d0
const uuid = UUID.generate(); // 3fd4c04a-8e73-4e10-aef3-f491b32ec538

// Hashes
const md5 = MD5Hash.from('hello'); // 5d41402abc4b2a76b9719d911017c592
const sha256 = SHA256Hash.from('hello'); // 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
const sha512 = SHA512Hash.from('hello'); // 9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043
console.log(md5.toBase64());

// Crypto
const keyPair = KeyPair.generate(); // Ed25519 key pair
const signature = keyPair.sign('hello world'); // Sign a message
keyPair.isValidSignature('hello world', signature); // true

// Encrypted key pairs
const encrypted = await keyPair.encryptKeyPair('my-password');
const sig = encrypted.sign('message', 'my-password');
encrypted.isValidSignature('message', sig); // true

// Media
const media = new Media('hello world');
console.log(media.getSize()); // 11
console.log(media.getBase64()); // 'aGVsbG8gd29ybGQ='
console.log(media.getBuffer()); // <Buffer 68 65 6c 6c 6f ...>

// Unique collections
const weekdays = UniqueObjectArray.fromArray([
  new DayOfWeek(EDaysOfWeek.MONDAY),
  new DayOfWeek(EDaysOfWeek.TUESDAY),
  new DayOfWeek(EDaysOfWeek.MONDAY),
]);
console.log(weekdays.length()); // 2
console.log(weekdays.toArray().map((day) => day.toString())); // ['monday', 'tuesday']
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

MIT License - see the [LICENSE](LICENSE.txt) file for details.

---

**Made with ❤️ and TypeScript**

[![CI](https://github.com/haskou/value-objects/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/haskou/value-objects/actions/workflows/ci.yml?query=branch%3Amaster)
[![codecov](https://codecov.io/gh/haskou/value-objects/branch/master/graph/badge.svg)](https://codecov.io/gh/haskou/value-objects)
[![npm version](https://img.shields.io/npm/v/@haskou/value-objects.svg)](https://www.npmjs.com/package/@haskou/value-objects)
[![license](https://img.shields.io/npm/l/@haskou/value-objects.svg)](LICENSE.txt)

# Value Objects

A TypeScript lightweight library for creating safe, immutable,
and validated **Value Objects**. Perfect for applications that require **Domain-Driven Design (DDD)** and **type safety**.

## 🚀 Quick Start

```bash
npm install @haskou/value-objects
```

```typescript
import { Email, PositiveNumber, Color, Hour } from '@haskou/value-objects';

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
- **`KeyPair`** - Ed25519 key pair generation for signing and verification
- **`PrivateKey`** - Ed25519 private key (PEM format) for signing; also accepted by asymmetric payload decryption for data addressed to the matching key pair
- **`PublicKey`** - Ed25519 public key (PEM format) for signature verification; also accepted by asymmetric payload encryption to address data to the matching key pair
- **`Signature`** - Base64-encoded Ed25519 digital signature
- **`EncryptedPayload`** - Base container for dot-separated encrypted payload formats
- **`AsymmetricEncryptedPayload`** - Payload encrypted for an Ed25519/X25519 recipient key pair
- **`SymmetricEncryptedPayload`** - Payload encrypted with a symmetric AES-256-GCM key
- **`SymmetricKey`** - 32-byte AES-256-GCM key, randomly generated or deterministically derived from a password and salt with scrypt
- **`EncryptedPrivateKey`** - Password-protected private key encryption using scrypt + AES-256-GCM
- **`EncryptedKeyPair`** - Key pair with encrypted private key

Technical notes:

- Asymmetric payload encryption is a classical hybrid scheme. It generates an ephemeral
  X25519 key pair, converts the recipient Ed25519 key material to Montgomery
  form for X25519 key agreement, derives a shared secret, then derives a
  256-bit AES key with HKDF-SHA256 and encrypts the payload with AES-256-GCM.
- The current asymmetric payload format is
  `v2.x25519-hkdf-sha256-aes-256-gcm.ephemeralPublicKey.iv.cipherText.tag`,
  with Base64-encoded key, IV, ciphertext, and tag fields. The previous
  `ephemeralPublicKey.iv.cipherText.tag` format still decrypts for backward
  compatibility.
- Symmetric payload encryption uses a 32-byte AES-256-GCM key directly. The
  payload format is `v1.aes-256-gcm.iv.cipherText.tag`, with Base64-encoded
  IV, ciphertext, and tag fields.
- `SymmetricKey.generate()` creates a random 256-bit key.
  `SymmetricKey.fromPasswordUsingOwasp()` derives a 256-bit key with the OWASP
  scrypt profile used by this package for new password-derived keys.
  `SymmetricKey.fromPassword()` keeps its original defaults for backward
  compatibility with existing encrypted data.
- A 32-byte key provides the AES-256 key size. Real security depends on using
  either a high-entropy random key or a strong password with a unique,
  non-empty salt. AES-GCM also requires that IVs do not repeat for the same key;
  the library generates a random 96-bit IV for each encryption.
- Payload encryption is intended for small payloads and is currently capped at
  1 MiB before encryption.
- New encrypted private keys use `v3.scrypt.N16384.r8.p5` with a 16-byte salt,
  then AES-256-GCM with a 12-byte IV and 16-byte authentication tag. The older
  v2 scrypt profile and legacy PBKDF2 format still decrypt, and
  `needsReEncryption()` marks them for upgrade.
- This is not a post-quantum cryptography scheme. Ed25519 and X25519 are
  classical elliptic-curve primitives, so neither signatures nor payload key
  agreement are post-quantum secure.
- Payload encryption uses fresh ephemeral key material and a random IV per
  encryption, but captured payloads can still be decrypted later if the
  recipient private key is compromised. Treat it as recipient-addressed
  encryption with ciphertext integrity, not as sender-authenticated encryption
  or a forward-secret transport protocol.
- The payload encryption format is library-specific, not HPKE, and has not been
  independently audited as a protocol.

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
const keyPair = await KeyPair.generate(); // Ed25519 key pair
const signature = keyPair.sign('hello world'); // Sign a message
keyPair.isValidSignature('hello world', signature); // true

// Encrypted key pairs
const encrypted = await keyPair.encryptKeyPair('my-password');
const sig = await encrypted.sign('message', 'my-password');
encrypted.isValidSignature('message', sig); // true

// Symmetric payload encryption
const symmetricKey = SymmetricKey.generate();
const symmetricPayload = symmetricKey.encrypt('secret data');
const plaintext = symmetricKey.decrypt(symmetricPayload);
console.log(plaintext.toString()); // 'secret data'

// Deterministic key derivation from a password and explicit salt
const derivedKey = await SymmetricKey.fromPasswordUsingOwasp('my-password', {
  salt: 'stable-application-salt',
});

// Media
const media = new Media('hello world');
console.log(media.getSize()); // 11
console.log(media.getBase64()); // 'aGVsbG8gd29ybGQ='
console.log(media.getBuffer()); // <Buffer 68 65 6c 6c 6f ...>

// Unique collections
const weekdays = UniqueObjectArray.fromArray([
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.MONDAY,
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

## 🌿 Release Branches

Publishing is handled by CI when a pull request is merged into the default
branch (`master`, or `main` after a branch rename). Use these branch prefixes
to choose the npm version bump:

- `fix/*` - patch release
- `feat/*` - minor release
- `break/*` - major release

Branches without one of these prefixes still run CI, but they do not publish
to npm. Publishing uses npm Trusted Publishing from the `ci.yml` workflow.
After a successful publish, CI commits the release version to the default
branch, creates the matching `vX.Y.Z` Git tag, and publishes a compact GitHub
Release with the PR title, npm package link, release branch, and PR notes.

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE.txt) file for details.

---

**Made with ❤️ and TypeScript**

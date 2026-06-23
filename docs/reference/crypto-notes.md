---
title: Crypto notes
description: Technical notes for cryptographic value objects.
---

# Crypto notes

This page documents the cryptographic value objects. It is intentionally outside the README so the README stays readable by mammals and hiring managers, a demographic overlap still under investigation.

## Key types

- `PrivateKey` stores an Ed25519 private key in PEM PKCS8 format.
- `PublicKey` stores an Ed25519 public key in PEM SPKI format.
- `Signature` stores an Ed25519 signature as Base64.
- `KeyPair` groups a public and private key.
- `EncryptedKeyPair` groups a public key with an encrypted private key.

## Signing

```typescript
const keyPair = await KeyPair.generate();
const signature = keyPair.sign('message');

keyPair.isValidSignature('message', signature); // true
```

## Asymmetric payload encryption

Asymmetric payload encryption uses a library-specific hybrid scheme.

Current format:

```text
v2.x25519-hkdf-sha256-aes-256-gcm.ephemeralPublicKey.iv.cipherText.tag
```

The high-level flow is:

1. Convert Ed25519 key material to X25519.
2. Generate ephemeral X25519 key material for each encryption.
3. Derive a shared secret.
4. Derive an AES key with HKDF-SHA256.
5. Encrypt the payload with AES-256-GCM.
6. Authenticate the current version and algorithm header as AAD.

Legacy asymmetric payloads with four parts are still recognized by `PrivateKey.decrypt()` for backward compatibility.

## Symmetric payload encryption

`SymmetricKey` stores a 32-byte AES-256-GCM key encoded as Base64.

Current format:

```text
v1.aes-256-gcm.iv.cipherText.tag
```

`SymmetricKey.encrypt()` generates a fresh 12-byte IV per encryption.

## Password-derived symmetric keys

```typescript
const key = await SymmetricKey.fromPasswordUsingOwasp(password, {
  salt: 'application-specific-salt',
});
```

The derived key is deterministic for the same password, salt, and scrypt parameters. Encryption remains non-deterministic because a fresh IV is generated for each payload.

The salt is not embedded in `SymmetricEncryptedPayload`. Callers must store or reproduce it.

## Encrypted private keys

New encrypted private keys use the current v3 handler.

The public container shape is versioned. Older formats are still accepted when recognized by the internal version handlers, and `needsReEncryption()` indicates whether the stored key should be upgraded.

## Limits and caveats

- Asymmetric payload encryption is capped at 1 MiB before encryption.
- Symmetric payload encryption is capped at 8 MiB before encryption.
- The asymmetric payload format is library-specific, not HPKE.
- The implementation is classical cryptography, not post-quantum cryptography.
- Payload encryption is recipient-addressed encryption with ciphertext integrity. It is not a forward-secret transport protocol.
- These helpers should not be presented as an independently audited protocol.

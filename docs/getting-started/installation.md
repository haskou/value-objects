---
title: Installation
description: Install @haskou/value-objects
---

# Installation

```bash
npm install @haskou/value-objects
```

```bash
yarn add @haskou/value-objects
```

```bash
pnpm add @haskou/value-objects
```

## Runtime requirements

The package does not declare a Node.js engine requirement. It publishes runtime-neutral value-object code with separate ESM and CommonJS entry points.

`UUID.generate()` and `ShortId.generate()` use the installed `uuid` dependency, which selects its Node or browser implementation. Node consumers do not need a global crypto object; browser bundlers select the browser entry automatically.

## Importing

ESM and TypeScript consumers can import from the package root:

```typescript
import { Email, Timestamp, UUID } from '@haskou/value-objects';
```

CommonJS consumers can continue using the package root:

```javascript
const { Email, Timestamp, UUID } = require('@haskou/value-objects');
```

The package export map resolves ESM to `dist/index.mjs` with `dist/index.d.mts` declarations, and CommonJS to `dist/index.cjs` with `dist/index.d.cts` declarations.

The ESM entry re-exports the CommonJS implementation, and its declarations re-export the same type definitions. Mixing `import` and `require` preserves class identity, equality, collection membership, and the global NullObject creation setting. Browser consumers need a bundler that handles CommonJS and the `buffer` package.

## Published files

Only `dist` is published. Source files are not part of the npm package payload.

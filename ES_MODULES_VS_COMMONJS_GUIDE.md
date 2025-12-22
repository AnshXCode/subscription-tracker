# ES Modules vs CommonJS: Complete Import Guide

## TL;DR - Quick Answer

**Check your `package.json`:**

- ✅ **If you have `"type": "module"`** → **ALWAYS use `import`** (never `require()`)
- ✅ **If you DON'T have `"type": "module"`** → Use `require()` for CommonJS, `import()` for ES modules

**For your project** (which has `"type": "module"`):

```javascript
// ✅ ALWAYS use import - for EVERYTHING (ES modules AND CommonJS packages)
import express from "express";
import bcrypt from "bcryptjs";
import { connectDB } from "./database/mongodb.js";

// ❌ NEVER use require() - it will error!
// const express = require('express');  // ERROR!
```

**The package type doesn't matter** - if your project is ES Module, use `import` for everything!

---

## Table of Contents

1. [When to Use `require()` vs `import` - Quick Decision Guide](#when-to-use-require-vs-import---quick-decision-guide)
2. [Overview: What are ES Modules and CommonJS?](#overview-what-are-es-modules-and-commonjs)
3. [ES Modules (ESM) - Modern JavaScript](#es-modules-esm---modern-javascript)
4. [CommonJS - Traditional Node.js](#commonjs---traditional-nodejs)
5. [How to Identify Package Module Type](#how-to-identify-package-module-type)
6. [Importing ES Module Packages](#importing-es-module-packages)
7. [Importing CommonJS Packages](#importing-commonjs-packages)
8. [Using CommonJS Packages in ES Module Projects](#using-commonjs-packages-in-es-module-projects)
9. [Common Scenarios and Solutions](#common-scenarios-and-solutions)
10. [Best Practices](#best-practices)
11. [Troubleshooting Common Errors](#troubleshooting-common-errors)

---

## When to Use `require()` vs `import` - Quick Decision Guide

**The golden rule**: The decision depends on **YOUR PROJECT TYPE**, not the package type!

### Step 1: Check Your Project Type

Look at your `package.json`:

```json
{
  "type": "module" // ← If this exists, you're using ES Modules
}
```

**OR**

```json
{
  // No "type" field → You're using CommonJS
}
```

### Step 2: Decision Tree

#### ✅ If Your Project Has `"type": "module"` (ES Module Project)

**ALWAYS use `import`** - Never use `require()`:

```javascript
// ✅ CORRECT - Use import for EVERYTHING
import express from "express"; // ES Module package
import bcrypt from "bcryptjs"; // CommonJS package
import mongoose from "mongoose"; // ES Module package
import cookieParser from "cookie-parser"; // CommonJS package
import { connectDB } from "./database/mongodb.js"; // Your own files

// ❌ WRONG - Never use require() in ES module projects
// const express = require('express');  // ERROR: require is not defined
```

**Key Points:**

- ✅ Use `import` for **ALL packages** (both ES Module and CommonJS)
- ✅ Use `import` for **your own files**
- ❌ **NEVER use `require()`** - it will throw an error
- ✅ Always include `.js` extension for local file imports

#### ✅ If Your Project Does NOT Have `"type": "module"` (CommonJS Project)

**Use `require()` for most cases**, `import()` only for ES Module packages:

```javascript
// ✅ CORRECT - Use require() for CommonJS packages
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

// ✅ CORRECT - Use dynamic import() for ES Module packages
const mongoose = (await import("mongoose")).default;

// ✅ CORRECT - Use require() for your own files
const { connectDB } = require("./database/mongodb");

// ❌ WRONG - Can't use static import in CommonJS
// import express from 'express';  // ERROR: Cannot use import statement
```

**Key Points:**

- ✅ Use `require()` for **CommonJS packages**
- ✅ Use `require()` for **your own files**
- ✅ Use dynamic `import()` for **ES Module packages** (returns a Promise)
- ❌ **Cannot use static `import`** statements

### Quick Reference: What to Use When

| Your Project Type                  | Package Type | What to Use          | Example                                     |
| ---------------------------------- | ------------ | -------------------- | ------------------------------------------- |
| **ES Module** (`"type": "module"`) | ES Module    | `import`             | `import express from 'express'`             |
| **ES Module** (`"type": "module"`) | CommonJS     | `import`             | `import bcrypt from 'bcryptjs'`             |
| **ES Module** (`"type": "module"`) | Your files   | `import`             | `import { func } from './file.js'`          |
| **CommonJS** (no `"type"`)         | CommonJS     | `require()`          | `const bcrypt = require('bcryptjs')`        |
| **CommonJS** (no `"type"`)         | ES Module    | `import()` (dynamic) | `const pkg = (await import('pkg')).default` |
| **CommonJS** (no `"type"`)         | Your files   | `require()`          | `const { func } = require('./file')`        |

### Special Case: Using `require()` in ES Module Projects

If you absolutely need `require()` in an ES module project (rare cases), use `createRequire`:

```javascript
// Only if you really need require() in an ES module project
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Now you can use require()
const someModule = require("./someModule.cjs");
```

**When would you need this?**

- Loading `.cjs` files in an ES module project
- Using packages that only work with `require()`
- Very rare edge cases

### Summary: The Simple Answer

**For your project** (which has `"type": "module"`):

```javascript
// ✅ ALWAYS use import - for everything!
import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./database/mongodb.js";

// ❌ NEVER use require()
// const express = require('express');  // This will ERROR!
```

**The package type doesn't matter** - if your project is ES Module, use `import` for everything!

---

## Overview: What are ES Modules and CommonJS?

JavaScript has two main module systems for organizing and sharing code:

### ES Modules (ESM)

- **Modern standard** introduced in ES6 (ES2015)
- Uses `import` and `export` statements
- Supported natively in modern browsers and Node.js (v12+)
- Static analysis - imports are resolved at compile time
- Better for tree-shaking and optimization

### CommonJS

- **Traditional Node.js** module system
- Uses `require()` and `module.exports`
- Default in Node.js for many years
- Dynamic loading - modules are loaded at runtime
- Still widely used in the Node.js ecosystem

---

## ES Modules (ESM) - Modern JavaScript

### Syntax

**Exporting:**

```javascript
// Named exports
export const myFunction = () => {
  /* ... */
};
export const myVariable = 42;

// Default export
export default myClass;

// Or export at the end
const myFunction = () => {
  /* ... */
};
export { myFunction };
```

**Importing:**

```javascript
// Named imports
import { myFunction, myVariable } from "./myModule.js";

// Default import
import myClass from "./myClass.js";

// Mixed imports
import myClass, { myFunction } from "./myModule.js";

// Namespace import (import everything)
import * as utils from "./utils.js";
// Usage: utils.myFunction()

// Import with alias
import { myFunction as func } from "./myModule.js";
```

### Key Characteristics

1. **File Extension Required**: Must use `.js` extension (or `.mjs`)
2. **Static Imports**: All imports must be at the top of the file
3. **Strict Mode**: Automatically runs in strict mode
4. **Top-Level Await**: Supports `await` at the top level
5. **Tree-Shakable**: Unused exports can be eliminated during bundling

### Example: ES Module Package

```javascript
// math-utils.js (ES Module)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

export default {
  add,
  subtract,
  multiply,
};
```

**Using it:**

```javascript
// app.js (ES Module)
import { add, subtract } from "./math-utils.js";
import mathUtils from "./math-utils.js";

console.log(add(5, 3)); // 8
console.log(mathUtils.multiply(2, 4)); // 8
```

---

## CommonJS - Traditional Node.js

### Syntax

**Exporting:**

```javascript
// Exporting a single value
module.exports = myFunction;

// Exporting an object
module.exports = {
  myFunction,
  myVariable: 42,
};

// Or using exports shorthand
exports.myFunction = () => {
  /* ... */
};
exports.myVariable = 42;
```

**Importing:**

```javascript
// Import entire module
const myModule = require("./myModule");

// Destructuring (if module exports an object)
const { myFunction, myVariable } = require("./myModule");

// Import with different name
const func = require("./myModule").myFunction;
```

### Key Characteristics

1. **No File Extension Needed**: `.js` extension is optional
2. **Dynamic Loading**: `require()` can be called anywhere, even conditionally
3. **Runtime Resolution**: Modules are loaded when `require()` is executed
4. **Synchronous**: Module loading is synchronous
5. **Default in Node.js**: Works without any configuration (unless `"type": "module"` is set)

### Example: CommonJS Package

```javascript
// math-utils.js (CommonJS)
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

module.exports = {
  add,
  subtract,
  multiply,
};
```

**Using it:**

```javascript
// app.js (CommonJS)
const { add, subtract } = require("./math-utils");
const mathUtils = require("./math-utils");

console.log(add(5, 3)); // 8
console.log(mathUtils.multiply(2, 4)); // 8
```

---

## How to Identify Package Module Type

### Method 1: Check `package.json`

Look for the `"type"` field in the package's `package.json`:

```json
{
  "name": "some-package",
  "type": "module", // ← ES Module
  "version": "1.0.0"
}
```

```json
{
  "name": "some-package",
  // No "type" field or "type": "commonjs" → CommonJS
  "version": "1.0.0"
}
```

### Method 2: Check File Extensions

- **ES Modules**: Uses `.mjs` extension OR `.js` with `"type": "module"` in package.json
- **CommonJS**: Uses `.cjs` extension OR `.js` without `"type": "module"`

### Method 3: Check Package Documentation

Most modern packages document their module type:

- Look for "ESM" or "ES Module" in README
- Check if examples use `import` or `require()`

### Method 4: Check `exports` Field in package.json

Modern packages use the `exports` field:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs", // ES Module entry
      "require": "./index.cjs" // CommonJS entry
    }
  }
}
```

### Common Package Examples

**ES Module Packages:**

- `express` (v4.16+)
- `mongoose` (v6+)
- `mongodb` (v4+)
- Most modern packages published after 2020

**CommonJS Packages:**

- `bcryptjs`
- `cookie-parser`
- `morgan`
- `debug`
- Many older Node.js packages

---

## Importing ES Module Packages

### In ES Module Projects

If your project has `"type": "module"` in `package.json`, you can import ES modules directly:

```javascript
// ✅ Correct - Direct import
import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
```

### In CommonJS Projects

If your project uses CommonJS, you need to use dynamic `import()`:

```javascript
// ❌ This won't work
// import express from 'express';

// ✅ Use dynamic import instead
const express = (await import("express")).default;
// Or
const { default: express } = await import("express");
```

**Note**: Dynamic `import()` returns a Promise, so you need to use `await` (inside async functions) or `.then()`.

---

## Importing CommonJS Packages

### In ES Module Projects

If your project has `"type": "module"` in `package.json`, you can import CommonJS packages using `import`:

```javascript
// ✅ Correct - Import CommonJS package in ES module project
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import morgan from "mongoose";
```

**Important Notes:**

- CommonJS packages can be imported using `import` syntax
- Default exports from CommonJS become the default import
- Named exports might not work as expected (depends on how the package exports)

### In CommonJS Projects

Use traditional `require()`:

```javascript
// ✅ Correct - Require CommonJS package
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
```

---

## Using CommonJS Packages in ES Module Projects

### Default Import (Most Common)

Most CommonJS packages export a default value:

```javascript
// CommonJS package exports:
// module.exports = someFunction;

// In ES Module project:
import someFunction from "commonjs-package";
```

### Named Exports (Limited Support)

Some CommonJS packages export named properties:

```javascript
// CommonJS package exports:
// module.exports = { func1, func2 };

// In ES Module project:
import * as packageName from "commonjs-package";
// Usage: packageName.func1()

// Or use default import and destructure
import pkg from "commonjs-package";
const { func1, func2 } = pkg;
```

### Example: Using `bcryptjs` (CommonJS) in ES Module Project

```javascript
// ✅ Correct usage
import bcrypt from "bcryptjs";

// Hash password
const hashedPassword = await bcrypt.hash("password123", 10);

// Compare password
const isMatch = await bcrypt.compare("password123", hashedPassword);
```

### Example: Using `cookie-parser` (CommonJS) in ES Module Project

```javascript
// ✅ Correct usage
import cookieParser from "cookie-parser";
import express from "express";

const app = express();
app.use(cookieParser());
```

---

## Common Scenarios and Solutions

### Scenario 1: Mixed Module Types in One Project

**Problem**: Your project uses ES modules, but some dependencies are CommonJS.

**Solution**: You can mix them! ES modules can import CommonJS packages:

```javascript
// app.js (ES Module)
import express from "express"; // ES Module
import bcrypt from "bcryptjs"; // CommonJS ✅ Works!
import mongoose from "mongoose"; // ES Module
import cookieParser from "cookie-parser"; // CommonJS ✅ Works!
```

### Scenario 2: CommonJS Package with Named Exports

**Problem**: A CommonJS package exports multiple named functions, but `import { func }` doesn't work.

**Solution**: Use namespace import or default import with destructuring:

```javascript
// ❌ This might not work
// import { func1, func2 } from 'package';

// ✅ Solution 1: Namespace import
import * as pkg from "package";
pkg.func1();
pkg.func2();

// ✅ Solution 2: Default import + destructure
import pkg from "package";
const { func1, func2 } = pkg;
```

### Scenario 3: Dynamic Import for Conditional Loading

**Problem**: You need to conditionally load a module.

**Solution**: Use dynamic `import()`:

```javascript
// ES Module - Dynamic import
if (someCondition) {
  const module = await import("./someModule.js");
  module.doSomething();
}

// CommonJS - Regular require works anywhere
if (someCondition) {
  const module = require("./someModule");
  module.doSomething();
}
```

### Scenario 4: Importing JSON Files

**ES Modules:**

```javascript
// ✅ Import JSON in ES modules
import config from './config.json' with { type: 'json' };
// Or (Node.js 17.5+)
import config from './config.json' assert { type: 'json' };
```

**CommonJS:**

```javascript
// ✅ Require JSON in CommonJS
const config = require("./config.json");
```

### Scenario 5: Package Documentation Shows `require()` but You Use `import`

**Problem**: Package documentation or examples show `require()`, but your project uses ES modules.

**Solution**: Convert `require()` to `import` syntax:

```javascript
// Package documentation shows:
// const bcrypt = require('bcryptjs');

// But in your ES module project, use:
import bcrypt from "bcryptjs"; // ✅ Works perfectly!
```

**Important**: Even if a package's documentation shows `require()`, you can still use `import` in ES module projects. The package type doesn't matter - what matters is YOUR project type!

---

## Best Practices

### 1. Use ES Modules for New Projects

```json
{
  "name": "my-project",
  "type": "module", // ✅ Set this for new projects
  "version": "1.0.0"
}
```

### 2. Consistent Import Style

```javascript
// ✅ Good: Group imports logically
// External packages
import express from "express";
import mongoose from "mongoose";

// Internal modules
import { connectDB } from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";

// Types/utilities
import { PORT } from "./config/env.js";
```

### 3. Always Use File Extensions in ES Modules

```javascript
// ✅ Correct
import { connectDB } from "./database/mongodb.js";

// ❌ Incorrect (might work but not recommended)
import { connectDB } from "./database/mongodb";
```

### 4. Handle CommonJS Default Exports Correctly

```javascript
// ✅ Correct - Most CommonJS packages export a default
import bcrypt from "bcryptjs";

// ❌ Incorrect - Don't try named import for default export
// import { hash } from 'bcryptjs'; // Won't work!
```

### 5. Use Dynamic Import for Conditional/Lazy Loading

```javascript
// ✅ Good for code splitting
const loadHeavyModule = async () => {
  const heavyModule = await import("./heavyModule.js");
  return heavyModule;
};
```

---

## Troubleshooting Common Errors

### Error 1: "Cannot use import statement outside a module"

**Problem**: You're using `import` in a file, but Node.js doesn't recognize it as an ES module.

**Solution**: Add `"type": "module"` to your `package.json`:

```json
{
  "type": "module"
}
```

Or rename your file to `.mjs`:

```bash
mv app.js app.mjs
```

### Error 2: "require is not defined"

**Problem**: You're using `require()` in an ES module project.

**Solution**: Use `import` instead:

```javascript
// ❌ Wrong
const express = require("express");

// ✅ Correct
import express from "express";
```

### Error 3: "The requested module does not provide an export named 'X'"

**Problem**: You're trying to use named import on a CommonJS package that only has a default export.

**Solution**: Use default import:

```javascript
// ❌ Wrong
import { hash } from 'bcryptjs';

// ✅ Correct
import bcrypt from 'bcryptjs';
bcrypt.hash(...);
```

### Error 4: "Must use import to load ES Module"

**Problem**: You're using `require()` to load an ES module package in a CommonJS project.

**Solution**: Use dynamic `import()`:

```javascript
// ❌ Wrong
const express = require("express");

// ✅ Correct
const express = (await import("express")).default;
```

### Error 5: "Cannot find module" or "Module not found"

**Problem**: Missing file extension in ES module import.

**Solution**: Add `.js` extension:

```javascript
// ❌ Wrong
import { connectDB } from "./database/mongodb";

// ✅ Correct
import { connectDB } from "./database/mongodb.js";
```

---

## Quick Reference Table

| Module Type   | Export Syntax                                  | Import Syntax                                                  | File Extension  | Package.json                      |
| ------------- | ---------------------------------------------- | -------------------------------------------------------------- | --------------- | --------------------------------- |
| **ES Module** | `export const x = ...`<br>`export default ...` | `import { x } from './file.js'`<br>`import x from './file.js'` | `.js` or `.mjs` | `"type": "module"`                |
| **CommonJS**  | `module.exports = ...`<br>`exports.x = ...`    | `const x = require('./file')`                                  | `.js` or `.cjs` | No `type` or `"type": "commonjs"` |

### Import Compatibility Matrix

| Your Project | Package Type | Import Method                     | Works?           |
| ------------ | ------------ | --------------------------------- | ---------------- |
| ES Module    | ES Module    | `import pkg from 'pkg'`           | ✅ Yes           |
| ES Module    | CommonJS     | `import pkg from 'pkg'`           | ✅ Yes           |
| CommonJS     | ES Module    | `const pkg = await import('pkg')` | ✅ Yes (dynamic) |
| CommonJS     | CommonJS     | `const pkg = require('pkg')`      | ✅ Yes           |

---

## Summary

### Key Takeaways

1. **ES Modules (ESM)**:

   - Use `import`/`export` syntax
   - Require `"type": "module"` in package.json
   - File extensions (`.js`) are required
   - Modern standard, better for optimization

2. **CommonJS**:

   - Use `require()`/`module.exports` syntax
   - Default in Node.js (unless `"type": "module"` is set)
   - No file extension needed
   - Still widely used in Node.js ecosystem

3. **Cross-Compatibility**:

   - ES modules can import CommonJS packages using `import`
   - CommonJS can import ES modules using dynamic `import()`
   - Most CommonJS packages work seamlessly in ES module projects

4. **Your Project**:

   - Your project uses ES modules (`"type": "module"` in package.json)
   - **ALWAYS use `import`** - never use `require()`
   - You can import both ES module and CommonJS packages using `import`
   - Always use `.js` extension for local file imports
   - Package documentation showing `require()`? Still use `import` - it works!

5. **The Golden Rule**:
   - **Your project type determines what you use, NOT the package type**
   - ES Module project → Always use `import`
   - CommonJS project → Use `require()` for CommonJS, `import()` for ES modules

---

## Additional Resources

- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)
- [MDN: ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Node.js CommonJS Documentation](https://nodejs.org/api/modules.html)

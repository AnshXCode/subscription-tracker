# Environment Configuration Guide

## Table of Contents

1. [Understanding `config/env.js`](#understanding-configenvjs)
2. [What is `process.env`?](#what-is-processenv)
3. [How Environment Variables Work](#how-environment-variables-work)
4. [The `NODE_ENV` Mystery Solved](#the-node_env-mystery-solved)
5. [Best Practices for `.env` Files](#best-practices-for-env-files)
6. [Security Considerations](#security-considerations)
7. [Common Patterns and Examples](#common-patterns-and-examples)
8. [Troubleshooting](#troubleshooting)

---

## Understanding `config/env.js`

### What This File Does

The `config/env.js` file serves as a centralized configuration loader for your application. Here's what it does:

```javascript
import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV } = process.env;
```

### Breaking It Down

1. **Imports `dotenv`**: Loads the `config` function from the `dotenv` package
2. **Dynamically loads environment file**: Uses `NODE_ENV` to determine which `.env` file to load
3. **Exports common variables**: Makes `PORT` and `NODE_ENV` available for import throughout your app

### Why This Pattern?

- **Single Source of Truth**: Environment variables are loaded once, in one place
- **Environment-Specific Config**: Different settings for development, production, and testing
- **Type Safety**: Explicit exports prevent typos and improve IDE autocomplete
- **Centralized Management**: Easy to modify how env vars are loaded

---

## What is `process.env`?

### Understanding `process.env`

`process.env` is a **global object** in Node.js that provides access to the **environment variables** of the operating system where your Node.js process is running. It's a bridge between your Node.js application and the operating system's environment.

### How `process.env` Connects to the Operating System

#### 1. **Direct OS Connection**

When Node.js starts, it automatically reads all environment variables from the operating system and makes them available through `process.env`. This happens **before** any of your code runs.

**On Linux/macOS:**

```bash
# These are OS-level environment variables
export NODE_ENV=production
export PATH=/usr/bin:/usr/local/bin
export HOME=/home/username

# When Node.js starts, they're immediately available
node app.js
# Inside Node.js: process.env.NODE_ENV === 'production'
```

**On Windows:**

```cmd
REM Set environment variable
set NODE_ENV=production

REM Or using PowerShell
$env:NODE_ENV="production"

REM Node.js reads these automatically
node app.js
```

#### 2. **Process Inheritance**

When you start a Node.js process, it inherits all environment variables from its parent process (usually your shell/terminal):

```
Operating System
    ↓
Shell/Terminal (bash, zsh, cmd, PowerShell)
    ↓ (inherits OS env vars)
Node.js Process
    ↓ (reads into process.env)
Your Application Code
```

#### 3. **What `process.env` Actually Is**

`process.env` is a **read-only object** that contains key-value pairs:

```javascript
// process.env structure (simplified)
process.env = {
  PATH: "/usr/bin:/usr/local/bin",
  HOME: "/home/username",
  NODE_ENV: "production",
  USER: "username",
  // ... all other OS environment variables
};
```

### Key Characteristics

#### ✅ **Read-Only by Default**

You can **read** from `process.env`:

```javascript
console.log(process.env.NODE_ENV); // ✅ Works
console.log(process.env.PATH); // ✅ Works
```

You can **modify** it (but it only affects the current process):

```javascript
process.env.MY_VAR = "value"; // ✅ Works (for current process only)
process.env.NODE_ENV = "production"; // ✅ Works (but doesn't change OS)
```

**Important**: Changes to `process.env` only affect the current Node.js process. They don't modify the actual operating system environment variables.

#### ✅ **Available Immediately**

`process.env` is populated **before** your code runs:

```javascript
// This works immediately - no dotenv needed
console.log(process.env.PATH); // ✅ Available from OS
console.log(process.env.HOME); // ✅ Available from OS
console.log(process.env.NODE_ENV); // ✅ Available if set in OS/shell
```

#### ✅ **Case-Sensitive Keys**

Environment variable names are case-sensitive:

```javascript
process.env.NODE_ENV; // ✅ Correct
process.env.node_env; // ❌ Different (undefined)
process.env.Node_Env; // ❌ Different (undefined)
```

### How the Operating System Stores Environment Variables

#### **Linux/macOS (Unix-like systems)**

Environment variables are stored in:

- **Current shell session**: `export VAR=value` (temporary, lost when shell closes)
- **User profile**: `~/.bashrc`, `~/.zshrc` (loaded for each new shell)
- **System-wide**: `/etc/environment` (affects all users)

**Viewing environment variables:**

```bash
# Print all environment variables
env

# Print specific variable
echo $NODE_ENV

# Print in Node.js
node -e "console.log(process.env.NODE_ENV)"
```

#### **Windows**

Environment variables are stored in:

- **User variables**: Stored in Windows Registry (User-specific)
- **System variables**: Stored in Windows Registry (All users)
- **Current session**: `set VAR=value` (temporary)

**Viewing environment variables:**

```cmd
REM Print all environment variables
set

REM Print specific variable
echo %NODE_ENV%

REM In PowerShell
$env:NODE_ENV
```

### The Relationship: OS → Node.js → Your Code

```
┌─────────────────────────────────────┐
│   Operating System                  │
│   (Environment Variables Storage)  │
│   - PATH=/usr/bin                   │
│   - HOME=/home/user                 │
│   - NODE_ENV=production             │
└──────────────┬──────────────────────┘
               │
               │ Node.js reads on startup
               ↓
┌─────────────────────────────────────┐
│   process.env (Node.js Object)      │
│   - process.env.PATH                │
│   - process.env.HOME                │
│   - process.env.NODE_ENV            │
└──────────────┬──────────────────────┘
               │
               │ Your code accesses
               ↓
┌─────────────────────────────────────┐
│   Your Application                  │
│   const port = process.env.PORT;    │
│   const env = process.env.NODE_ENV; │
└─────────────────────────────────────┘
```

### Common OS Environment Variables

These are automatically available in `process.env`:

| Variable            | Description               | Example                   |
| ------------------- | ------------------------- | ------------------------- |
| `PATH`              | Executable search paths   | `/usr/bin:/usr/local/bin` |
| `HOME`              | User's home directory     | `/home/username`          |
| `USER` / `USERNAME` | Current username          | `john`                    |
| `PWD`               | Current working directory | `/home/user/project`      |
| `SHELL`             | Default shell             | `/bin/bash`               |
| `LANG`              | Language/locale           | `en_US.UTF-8`             |
| `TMPDIR` / `TEMP`   | Temporary directory       | `/tmp`                    |

### Setting Environment Variables Before Node.js Starts

#### **Method 1: Inline with Command**

```bash
NODE_ENV=production PORT=3000 node app.js
```

#### **Method 2: Export in Shell (Linux/macOS)**

```bash
export NODE_ENV=production
export PORT=3000
node app.js
```

#### **Method 3: Set in Shell Script**

```bash
#!/bin/bash
export NODE_ENV=production
export PORT=3000
node app.js
```

#### **Method 4: Windows Command Prompt**

```cmd
set NODE_ENV=production
set PORT=3000
node app.js
```

#### **Method 5: Windows PowerShell**

```powershell
$env:NODE_ENV="production"
$env:PORT="3000"
node app.js
```

### How `dotenv` Extends `process.env`

The `dotenv` package **adds** variables to `process.env` from `.env` files:

```javascript
// Before dotenv.config()
console.log(process.env.PORT); // undefined (unless set in OS)

// Load .env file
import { config } from "dotenv";
config();

// After dotenv.config()
console.log(process.env.PORT); // '3000' (from .env file)
```

**Important**: `dotenv` doesn't replace `process.env` - it **extends** it. OS environment variables take precedence over `.env` file variables.

### Precedence Order

When the same variable exists in multiple places, this is the order of precedence:

```
1. OS Environment Variables (highest priority)
   ↓
2. Variables set via command line
   ↓
3. Variables from .env files (lowest priority)
```

**Example:**

```bash
# OS has NODE_ENV=production
export NODE_ENV=production

# .env file has NODE_ENV=development
# NODE_ENV=development

# Result: process.env.NODE_ENV === 'production' (OS wins)
```

### Practical Example: Tracing the Flow

```bash
# Step 1: Set in OS/shell
export NODE_ENV=production
export PORT=8080

# Step 2: Start Node.js
node app.js
```

**Inside Node.js:**

```javascript
// Step 3: process.env already has OS variables
console.log(process.env.NODE_ENV); // 'production' ✅
console.log(process.env.PORT); // '8080' ✅

// Step 4: Load .env file (if exists)
import { config } from "dotenv";
config({ path: ".env.production.local" });

// Step 5: .env file variables are added (if not already set)
// If .env.production.local has PORT=3000, it won't override
// because OS already set PORT=8080
console.log(process.env.PORT); // Still '8080' (OS takes precedence)
```

### Summary: `process.env` and the OS

- ✅ `process.env` is a **read-only object** containing OS environment variables
- ✅ It's populated **automatically** when Node.js starts
- ✅ It's a **bridge** between your Node.js app and the operating system
- ✅ Changes to `process.env` only affect the current Node.js process
- ✅ OS environment variables **take precedence** over `.env` file variables
- ✅ `dotenv` **extends** `process.env` with variables from `.env` files

---

## How Environment Variables Work

### Two Types of Environment Variables

#### 1. System Environment Variables (`process.env`)

- Set by the operating system/shell
- Available immediately when Node.js starts
- Examples: `NODE_ENV`, `PATH`, `HOME`
- Set via: command line, system exports, deployment platforms

#### 2. `.env` File Variables

- Stored in files (`.env.development.local`, `.env.production.local`, etc.)
- Loaded by `dotenv` package
- Convenience for local development
- Examples: `PORT`, `DATABASE_URL`, `API_KEY`

### The Loading Order

```
1. Node.js starts → System environment variables populate `process.env`
2. Your code runs → `process.env.NODE_ENV` is already available (if set)
3. `dotenv.config()` runs → Reads `.env.{NODE_ENV}.local` file
4. Variables from `.env` file → Added to `process.env`
```

---

## The `NODE_ENV` Mystery Solved

### ❌ Common Misconception

Many developers think: "I need to define `NODE_ENV` in my `.env` file"

### ✅ The Truth

**You should NOT define `NODE_ENV` in `.env` files!**

### Why?

1. **Circular Dependency**: `NODE_ENV` is used to determine which `.env` file to load. If it's inside the file, you'd need to know which file to load first!

2. **System-Level Setting**: `NODE_ENV` indicates the runtime environment and should be set externally:

   - Deployment platforms (Heroku, AWS, Docker)
   - npm scripts in `package.json`
   - System environment variables
   - Command line arguments

3. **Best Practice**: `.env` files are for application configuration, not system settings

### How to Set `NODE_ENV` Properly

#### Option 1: In `package.json` scripts

```json
{
  "scripts": {
    "start": "NODE_ENV=production node app.js",
    "dev": "NODE_ENV=development nodemon app.js",
    "test": "NODE_ENV=test node test.js"
  }
}
```

#### Option 2: Command Line

```bash
NODE_ENV=production node app.js
```

#### Option 3: System Export

```bash
export NODE_ENV=production
node app.js
```

#### Option 4: Deployment Platform

```bash
# Heroku
heroku config:set NODE_ENV=production

# Docker
ENV NODE_ENV=production

# AWS/Cloud platforms
# Set via platform's environment variable configuration
```

---

## Best Practices for `.env` Files

### 1. File Naming Convention

Use the pattern: `.env.{environment}.local`

- `.env.development.local` - Local development overrides
- `.env.production.local` - Production secrets (never commit!)
- `.env.test.local` - Test environment variables

**Why `.local`?**

- `.local` files are typically gitignored (personal/local overrides)
- Base files (`.env.development`) can be committed with defaults
- `.local` files override base files

### 2. What Should Be in `.env` Files?

#### ✅ DO Include:

- **Application Configuration**
  ```bash
  PORT=3000
  API_URL=https://api.example.com
  LOG_LEVEL=debug
  ```
- **Database Connections**
  ```bash
  DATABASE_URL=postgres://user:pass@localhost:5432/mydb
  REDIS_URL=redis://localhost:6379
  ```
- **API Keys & Secrets**
  ```bash
  JWT_SECRET=your-secret-key-here
  STRIPE_API_KEY=sk_test_...
  AWS_ACCESS_KEY_ID=...
  ```
- **Feature Flags**
  ```bash
  ENABLE_NEW_FEATURE=true
  MAINTENANCE_MODE=false
  ```

#### ❌ DON'T Include:

- `NODE_ENV` (set externally)
- System paths (`PATH`, `HOME`)
- Already public information
- Hardcoded values that shouldn't change

### 3. Gitignore Configuration

Always ensure `.env` files are gitignored:

```gitignore
# dotenv environment variables file
.env
.env.*.local
```

**Why?**

- `.env.local` files contain secrets
- Different developers may need different local configs
- Prevents accidentally committing sensitive data

### 4. Create `.env.example` Files

Create example files (without secrets) that can be committed:

**`.env.development.example`**:

```bash
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-here
API_URL=https://api.example.com
```

This helps:

- New developers know what variables are needed
- Documents required configuration
- Provides a template to copy

### 5. Variable Naming Conventions

- Use **UPPERCASE** with **UNDERSCORES**: `DATABASE_URL`, `API_KEY`
- Be descriptive: `DATABASE_URL` not `DB`
- Group related vars: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- Use prefixes for namespacing: `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`

### 6. Default Values

Provide sensible defaults in your code:

```javascript
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
```

### 7. Validation

Validate required environment variables at startup:

```javascript
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "API_KEY"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

---

## Security Considerations

### 1. Never Commit Secrets

- ✅ Commit: `.env.example` (without real values)
- ❌ Never commit: `.env`, `.env.local`, `.env.*.local`

### 2. Use Different Secrets Per Environment

```bash
# Development
JWT_SECRET=dev-secret-123

# Production
JWT_SECRET=super-secure-random-string-here
```

### 3. Rotate Secrets Regularly

- Change API keys periodically
- Update database passwords
- Rotate JWT secrets

### 4. Use Secret Management Services

For production, consider:

- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Azure Key Vault**
- **Google Secret Manager**

### 5. Limit Access

- Only give access to `.env` files to developers who need them
- Use different secrets for different environments
- Never share production secrets

### 6. Environment Variable Injection

In production, prefer setting environment variables directly rather than using `.env` files:

```bash
# Better for production
export DATABASE_URL=postgres://...
export JWT_SECRET=...

# Rather than
# Reading from .env.production.local file
```

---

## Common Patterns and Examples

### Pattern 1: Environment-Specific Configuration

**`.env.development.local`**:

```bash
PORT=3000
DATABASE_URL=postgres://localhost:5432/mydb_dev
API_URL=http://localhost:4000
LOG_LEVEL=debug
JWT_SECRET=dev-secret-key
```

**`.env.production.local`**:

```bash
PORT=8080
DATABASE_URL=postgres://prod-server:5432/mydb_prod
API_URL=https://api.example.com
LOG_LEVEL=error
JWT_SECRET=super-secure-production-secret
```

### Pattern 2: Enhanced `config/env.js`

```javascript
import { config } from "dotenv";

// Load environment-specific config
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// Validate required variables
const requiredVars = ["DATABASE_URL", "JWT_SECRET"];
requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
});

// Export with defaults
export const PORT = parseInt(process.env.PORT || "3000", 10);
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";
export const API_URL = process.env.API_URL;

// Helper to check if production
export const isProduction = NODE_ENV === "production";
export const isDevelopment = NODE_ENV === "development";
export const isTest = NODE_ENV === "test";
```

### Pattern 3: Using in Your Application

```javascript
// app.js
import express from "express";
import { PORT, NODE_ENV, isProduction } from "./config/env.js";

const app = express();

// Use environment variables
if (!isProduction) {
  app.use(morgan("dev")); // Only in development
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
```

### Pattern 4: Database Configuration

```javascript
// config/database.js
import { DATABASE_URL } from "./env.js";

const dbConfig = {
  url: DATABASE_URL,
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || "2", 10),
    max: parseInt(process.env.DB_POOL_MAX || "10", 10),
  },
};

export default dbConfig;
```

---

## Troubleshooting

### Problem: `NODE_ENV` is undefined

**Solution**: Set it before running your app:

```bash
NODE_ENV=development node app.js
```

Or in `package.json`:

```json
"scripts": {
  "dev": "NODE_ENV=development nodemon app.js"
}
```

### Problem: Environment variables not loading

**Check**:

1. Is the `.env` file in the project root?
2. Is the file name correct? (`.env.development.local` for development)
3. Is `dotenv` installed? (`npm install dotenv`)
4. Is `config/env.js` imported before other modules that need env vars?

### Problem: Variables are `undefined`

**Possible causes**:

- Variable not defined in `.env` file
- Typo in variable name (case-sensitive!)
- `.env` file not being loaded
- Variable not exported from `config/env.js`

### Problem: Wrong environment file being loaded

**Check**:

- What is `process.env.NODE_ENV` set to?
- Does the corresponding `.env.{NODE_ENV}.local` file exist?
- Check the path in `config/env.js`

### Debugging Tips

```javascript
// Add this temporarily to see what's loaded
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("All env vars:", Object.keys(process.env));
```

---

## Summary

### Key Takeaways

1. ✅ **Use `config/env.js`** to centralize environment variable loading
2. ✅ **Set `NODE_ENV` externally** (not in `.env` files)
3. ✅ **Use `.env.{environment}.local`** naming convention
4. ✅ **Never commit** `.env.local` files (gitignore them)
5. ✅ **Create `.env.example`** files for documentation
6. ✅ **Validate required variables** at startup
7. ✅ **Use different secrets** for each environment
8. ✅ **Follow naming conventions** (UPPERCASE_WITH_UNDERSCORES)

### Quick Reference

```bash
# Set NODE_ENV
NODE_ENV=production node app.js

# Create .env file
touch .env.development.local

# Check environment variables
node -e "console.log(process.env.NODE_ENV)"
```

---

## Additional Resources

- [dotenv Documentation](https://github.com/motdotla/dotenv)
- [12-Factor App: Config](https://12factor.net/config)
- [Node.js Environment Variables](https://nodejs.org/api/process.html#process_process_env)

---

_Last updated: Based on project configuration patterns_

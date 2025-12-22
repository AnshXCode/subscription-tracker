# JWT Token: Complete Guide

## Table of Contents

1. [Authentication vs Authorization](#authentication-vs-authorization)
2. [What is a JWT Token?](#what-is-a-jwt-token)
3. [Understanding `jwt.sign()`](#understanding-jwtsign)
4. [Token Structure and Data Storage](#token-structure-and-data-storage)
5. [How Token Verification Works](#how-token-verification-works)
6. [Complete Authentication Flow](#complete-authentication-flow)
7. [Security Considerations](#security-considerations)
8. [Common Errors and Troubleshooting](#common-errors-and-troubleshooting)

---

## Authentication vs Authorization

Before diving into JWT tokens, it's crucial to understand the difference between **authentication** and **authorization**. These are two distinct security concepts that work together to protect your application.

### Authentication: "Who are you?"

**Authentication** is the process of **verifying the identity** of a user. It answers the question: **"Who are you?"**

**What it does:**

- Confirms that a user is who they claim to be
- Validates credentials (username/password, email/password, etc.)
- Establishes the user's identity
- Creates a session or issues a token

**Common methods:**

- Username and password
- Email and password
- Social login (Google, Facebook, GitHub)
- Biometric authentication (fingerprint, face recognition)
- Multi-factor authentication (MFA)

**Example in your code:**

```javascript
// controllers/auth.controller.js - signIn function
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Step 1: Find user by email (identify who they claim to be)
  const user = await User.findOne({ email });

  // Step 2: Verify password (authenticate their identity)
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid password");
    error.statusCode = 401; // Unauthorized - authentication failed
    return next(error);
  }

  // Step 3: Authentication successful - issue token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // Token proves the user has been authenticated
  res.status(200).json({ success: true, data: { user, token } });
};
```

**Key points:**

- Happens **once** during login/signup
- Results in a **token** or **session** that proves authentication
- HTTP status code: `401 Unauthorized` (confusing name, but means "not authenticated")

### Authorization: "What can you do?"

**Authorization** is the process of **determining what actions** a user is allowed to perform. It answers the question: **"What can you do?"**

**What it does:**

- Checks if an authenticated user has permission to access a resource
- Determines what operations a user can perform
- Enforces access control rules
- Happens **after** authentication

**Common examples:**

- Can this user view their own profile? (Yes - they're authorized)
- Can this user delete another user's data? (No - not authorized)
- Can this user access admin panel? (Only if they have admin role)
- Can this user edit this specific post? (Only if they're the author)

**Example in your code:**

```javascript
// Middleware: First authenticates, then authorizes
export const authenticateToken = (req, res, next) => {
  // AUTHENTICATION: Verify token (who are you?)
  const token = extractToken(req);
  const decoded = jwt.verify(token, JWT_SECRET);
  req.userId = decoded.userId; // User is authenticated

  next(); // Continue to controller
};

// Controller: Authorization check (what can you do?)
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId; // From authentication middleware

  // AUTHORIZATION: Check if user can delete this resource
  if (userId !== id) {
    const error = new Error("You can only delete your own account");
    error.statusCode = 403; // Forbidden - authenticated but not authorized
    return next(error);
  }

  // User is authorized - proceed with deletion
  await User.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "User deleted" });
};
```

**Key points:**

- Happens on **every protected request**
- Checks permissions based on user role, ownership, or other rules
- HTTP status code: `403 Forbidden` (authenticated but not authorized)

### Visual Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                            │
│                  "Who are you?"                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User: "I'm john@example.com"                               │
│         ↓                                                    │
│  Server: "Prove it - what's your password?"                 │
│         ↓                                                    │
│  User: "password123"                                         │
│         ↓                                                    │
│  Server: "✓ Password correct - you are authenticated"       │
│         ↓                                                    │
│  Server: "Here's your token: eyJhbGc..."                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION                            │
│                  "What can you do?"                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User: "I want to delete user ID 123"                       │
│         ↓                                                    │
│  Server: "✓ Token valid - you're authenticated"             │
│         ↓                                                    │
│  Server: "Are you authorized? Let me check..."              │
│         ↓                                                    │
│  Server: "Your userId: 456, Target userId: 123"            │
│         ↓                                                    │
│  Server: "✗ Not authorized - you can only delete yourself" │
│         ↓                                                    │
│  Response: 403 Forbidden                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Real-World Analogy

Think of a **nightclub**:

**Authentication:**

- Bouncer checks your ID: "Are you 21+?" (verifying identity)
- You show your ID, bouncer confirms: "✓ You're authenticated"
- You get a wristband (like a token)

**Authorization:**

- You try to enter VIP section: "Can you access VIP?" (checking permissions)
- Bouncer checks your wristband: "✗ Regular wristband - VIP not authorized"
- You try to buy alcohol: "✓ Regular wristband allows alcohol - authorized"

### HTTP Status Codes

**Authentication failures:**

- `401 Unauthorized` - User is not authenticated (no valid token/credentials)
- Meaning: "I don't know who you are"

**Authorization failures:**

- `403 Forbidden` - User is authenticated but not authorized for this action
- Meaning: "I know who you are, but you can't do this"

### How JWT Tokens Fit In

**JWT tokens are primarily used for authentication:**

1. **During sign-in/sign-up:** Token is created after successful authentication
2. **On protected routes:** Token is verified to authenticate the user
3. **Authorization** happens separately by checking:
   - User roles stored in the token (e.g., `{ userId, role: 'admin' }`)
   - User ownership (e.g., `userId === resource.ownerId`)
   - Permissions in database or token claims

**Example: Using JWT for both authentication and authorization**

```javascript
// Sign in - Authentication
const token = jwt.sign(
  { userId: user._id, role: user.role }, // Include role for authorization
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

// Middleware - Authentication
export const authenticateToken = (req, res, next) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  req.userId = decoded.userId;
  req.userRole = decoded.role; // For authorization checks
  next();
};

// Controller - Authorization check
export const deleteAnyUser = async (req, res, next) => {
  // User is authenticated (has valid token)

  // Authorization check: Only admins can delete any user
  if (req.userRole !== "admin") {
    const error = new Error("Admin access required");
    error.statusCode = 403; // Forbidden - not authorized
    return next(error);
  }

  // Authorized - proceed
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
};
```

### Summary

| Aspect           | Authentication       | Authorization                     |
| ---------------- | -------------------- | --------------------------------- |
| **Question**     | "Who are you?"       | "What can you do?"                |
| **Purpose**      | Verify identity      | Check permissions                 |
| **When**         | During login/signup  | On every protected request        |
| **Result**       | Token/session issued | Access granted/denied             |
| **Failure Code** | `401 Unauthorized`   | `403 Forbidden`                   |
| **Example**      | Login with password  | Check if user can delete resource |

**Remember:** Authentication must happen **before** authorization. You can't authorize someone if you don't know who they are!

---

## What is a JWT Token?

**JWT (JSON Web Token)** is a compact, URL-safe token format used for securely transmitting information between parties. It's commonly used for authentication and authorization in web applications.

### Key Characteristics:

- **Stateless**: The server doesn't need to store session data
- **Self-contained**: All necessary information is encoded in the token itself
- **Signed**: Cryptographically signed to prevent tampering
- **Compact**: Can be sent via URL, POST parameter, or HTTP header

---

## Understanding `jwt.sign()`

### The Code in Context

```javascript
const token = jwt.sign({ userId: users[0]._id }, JWT_SECRET, {
  expiresIn: JWT_EXPIRES_IN,
});
```

### Breaking Down the Parameters

#### 1. **Payload (First Parameter): `{ userId: users[0]._id }`**

This is the **data** you want to store in the token. It's called the "payload" or "claims."

```javascript
{
  userId: users[0]._id; // Example: userId: "507f1f77bcf86cd799439011"
}
```

**What gets stored:**

- `userId`: The MongoDB ObjectId of the user (e.g., `"507f1f77bcf86cd799439011"`)
- This is the **custom claim** you're adding to identify the user

**Important Notes:**

- The payload is **base64url encoded** (not encrypted), so it can be decoded by anyone
- **Never store sensitive data** like passwords, credit card numbers, or SSNs in the payload
- Only store non-sensitive identifiers like `userId`, `email`, `role`, etc.

#### 2. **Secret Key (Second Parameter): `JWT_SECRET`**

This is a **secret string** used to sign the token cryptographically.

```javascript
// From config/env.js
export const { JWT_SECRET } = process.env;
// Example: JWT_SECRET = "my-super-secret-key-12345"
```

**Purpose:**

- Used to create a **signature** that proves the token hasn't been tampered with
- Must be kept **secret** on the server (never exposed to clients)
- Should be a long, random, unpredictable string (at least 32 characters)
- Typically stored in environment variables (`.env` file)

**How it works:**

- The server uses this secret to create a cryptographic signature
- When verifying, the server checks if the signature matches
- If someone modifies the token, the signature won't match, and verification fails

#### 3. **Options (Third Parameter): `{ expiresIn: JWT_EXPIRES_IN }`**

This object contains **configuration options** for the token.

```javascript
{
  expiresIn: JWT_EXPIRES_IN; // Example: "7d" (7 days), "24h" (24 hours), "3600" (3600 seconds)
}
```

**Common `expiresIn` formats:**

- `"7d"` - 7 days
- `"24h"` - 24 hours
- `"1h"` - 1 hour
- `"3600"` - 3600 seconds (1 hour)
- `"60m"` - 60 minutes

**What happens:**

- The library automatically adds an `exp` (expiration) claim to the payload
- After expiration, the token becomes invalid
- The server will reject expired tokens during verification

**Other common options:**

```javascript
{
  expiresIn: "7d",
  issuer: "my-app",           // Who issued the token
  audience: "my-app-users",   // Who the token is intended for
  algorithm: "HS256"          // Signing algorithm (default: HS256)
}
```

---

## Token Structure and Data Storage

### JWT Token Format

A JWT token consists of **three parts** separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDYwNDgwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Format:** `HEADER.PAYLOAD.SIGNATURE`

### 1. Header (First Part)

**What it contains:**

```json
{
  "alg": "HS256", // Algorithm used for signing (HMAC SHA256)
  "typ": "JWT" // Type of token
}
```

**Purpose:**

- Specifies the signing algorithm
- Indicates this is a JWT token
- Base64url encoded

**Decoded example:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

### 2. Payload (Second Part)

**What it contains:**

```json
{
  "userId": "507f1f77bcf86cd799439011", // Your custom claim
  "iat": 1700000000, // Issued at (timestamp)
  "exp": 1700604800 // Expiration (timestamp)
}
```

**Standard Claims (automatically added):**

- `iat` (Issued At): Timestamp when token was created
- `exp` (Expiration): Timestamp when token expires
- `nbf` (Not Before): Token not valid before this time (optional)
- `iss` (Issuer): Who issued the token (optional)
- `aud` (Audience): Intended recipient (optional)

**Custom Claims (your data):**

- `userId`: The MongoDB ObjectId you provided

**Decoded example:**

```
eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDYwNDgwMH0
```

**Important:** The payload is **base64url encoded**, NOT encrypted. Anyone can decode it and read the contents. This is why you should never store sensitive data.

### 3. Signature (Third Part)

**What it contains:**

- A cryptographic signature created using:
  - The encoded header
  - The encoded payload
  - The secret key (`JWT_SECRET`)
  - The algorithm specified in the header

**How it's created:**

```
signature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

**Purpose:**

- Ensures the token hasn't been tampered with
- Verifies the token was issued by your server
- If someone modifies the payload, the signature won't match

**Decoded example:**

```
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Complete Token Breakdown

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDYwNDgwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│─────────────────────────────────││──────────────────────────────────────────────────────────────││────────────────────────────────────────│
│         HEADER                   ││                        PAYLOAD                              ││            SIGNATURE                   │
│  (Algorithm & Type)              ││  (userId + iat + exp)                                        ││  (Cryptographic signature)            │
```

---

## How Token Verification Works

### The Verification Process

When a client sends a request with a JWT token, the server needs to:

1. **Extract the token** from the request (usually from Authorization header)
2. **Verify the signature** to ensure it hasn't been tampered with
3. **Check expiration** to ensure it's still valid
4. **Extract the userId** from the payload

### Step-by-Step: Creating an Authentication Middleware

Here's how you would create middleware to verify tokens and extract `userId`:

#### 1. Extract Token from Request

```javascript
// Common ways to send token:
// 1. Authorization header: "Bearer <token>"
// 2. Cookie: token=<token>
// 3. Query parameter: ?token=<token>

// Example: Extract from Authorization header
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  const error = new Error("No token provided");
  error.statusCode = 401;
  return next(error);
}

const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix
```

#### 2. Verify and Decode Token

```javascript
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

try {
  // jwt.verify() does THREE things:
  // 1. Verifies the signature matches (token wasn't tampered with)
  // 2. Checks if token is expired (compares exp with current time)
  // 3. Returns the decoded payload if everything is valid

  const decoded = jwt.verify(token, JWT_SECRET);

  // decoded now contains:
  // {
  //   userId: "507f1f77bcf86cd799439011",
  //   iat: 1700000000,
  //   exp: 1700604800
  // }

  // Extract userId from decoded payload
  req.userId = decoded.userId;

  // Continue to next middleware/controller
  next();
} catch (error) {
  // Handle different error types
  if (error.name === "TokenExpiredError") {
    const err = new Error("Token expired");
    err.statusCode = 401;
    return next(err);
  }

  if (error.name === "JsonWebTokenError") {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    return next(err);
  }

  // Other errors
  next(error);
}
```

#### 3. Complete Authentication Middleware Example

```javascript
// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const authenticateToken = (req, res, next) => {
  // Step 1: Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    return next(error);
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Step 2: Verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Step 3: Extract userId from decoded payload
    req.userId = decoded.userId;

    // Step 4: Continue to next middleware/controller
    next();
  } catch (error) {
    // Handle verification errors
    if (error.name === "TokenExpiredError") {
      const err = new Error("Token has expired");
      err.statusCode = 401;
      return next(err);
    }

    if (error.name === "JsonWebTokenError") {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      return next(err);
    }

    // Other errors
    next(error);
  }
};
```

#### 4. Using the Middleware in Routes

```javascript
// routes/user.routes.js
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

// Protected route - requires authentication
router.get("/profile", authenticateToken, getUserProfile);

export default router;
```

#### 5. Using userId in Controller

```javascript
// controllers/user.controller.js
import User from "../models/user.model.js";

export const getUserProfile = async (req, res, next) => {
  try {
    // req.userId is set by authenticateToken middleware
    const userId = req.userId; // "507f1f77bcf86cd799439011"

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Complete Authentication Flow

### Full Request-Response Cycle

#### 1. User Signs Up / Signs In

```javascript
// Client sends: POST /api/v1/auth/sign-up
// Body: { name: "John", email: "john@example.com", password: "password123" }

// Server creates token:
const token = jwt.sign({ userId: users[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// Server responds:
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Client Stores Token

```javascript
// Client (browser/app) stores token:
localStorage.setItem("token", token);
// OR
document.cookie = `token=${token}; HttpOnly; Secure`;
```

#### 3. Client Sends Authenticated Request

```javascript
// Client sends: GET /api/v1/users/profile
// Headers: {
//   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
// }

// Example using fetch:
fetch("/api/v1/users/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

#### 4. Server Verifies Token

```javascript
// Middleware extracts and verifies:
const decoded = jwt.verify(token, JWT_SECRET);
// decoded = { userId: "507f1f77bcf86cd799439011", iat: ..., exp: ... }

// Middleware sets req.userId
req.userId = decoded.userId;
```

#### 5. Server Processes Request

```javascript
// Controller uses req.userId
const user = await User.findById(req.userId);
// Returns user data
```

### Visual Flow Diagram

```
┌─────────┐                    ┌─────────┐
│ Client  │                    │ Server  │
└────┬────┘                    └────┬────┘
     │                              │
     │  1. POST /sign-up            │
     │  { name, email, password }   │
     ├─────────────────────────────>│
     │                              │
     │                              │ 2. Create user in DB
     │                              │ 3. Generate token:
     │                              │    jwt.sign({userId}, SECRET)
     │                              │
     │  4. Response with token      │
     │  { token: "eyJhbGc..." }     │
     │<─────────────────────────────┤
     │                              │
     │  5. Store token              │
     │  localStorage.setItem(...)   │
     │                              │
     │  6. GET /profile             │
     │  Authorization: Bearer token │
     ├─────────────────────────────>│
     │                              │
     │                              │ 7. Verify token:
     │                              │    jwt.verify(token, SECRET)
     │                              │ 8. Extract userId
     │                              │ 9. Find user by userId
     │                              │
     │  10. Response with user      │
     │  { user: {...} }             │
     │<─────────────────────────────┤
     │                              │
```

---

## Security Considerations

### 1. Secret Key Security

**❌ BAD:**

```javascript
const JWT_SECRET = "my-secret-key"; // Hardcoded secret
```

**✅ GOOD:**

```javascript
// Store in .env file (never commit to git)
JWT_SECRET=your-super-long-random-secret-key-at-least-32-characters-long

// Load from environment
import { JWT_SECRET } from '../config/env.js';
```

**Best Practices:**

- Use a long, random string (at least 32 characters)
- Never commit secrets to version control
- Use different secrets for development and production
- Rotate secrets periodically

### 2. Token Storage

**❌ BAD:**

```javascript
// Storing in localStorage (vulnerable to XSS attacks)
localStorage.setItem("token", token);
```

**✅ GOOD:**

```javascript
// Option 1: HttpOnly cookies (prevents XSS)
res.cookie("token", token, {
  httpOnly: true, // Cannot be accessed via JavaScript
  secure: true, // Only sent over HTTPS
  sameSite: "strict",
});

// Option 2: Memory storage (for mobile apps)
// Store token in memory, not persistent storage
```

### 3. Token Expiration

**Why it matters:**

- Limits damage if token is stolen
- Forces periodic re-authentication
- Reduces risk of long-term token compromise

**Recommendations:**

- Short-lived tokens: 15 minutes to 1 hour for sensitive operations
- Medium-lived tokens: 24 hours for regular sessions
- Long-lived tokens: 7-30 days with refresh token mechanism

### 4. HTTPS Only

**Always use HTTPS in production:**

- Prevents token interception during transmission
- Protects against man-in-the-middle attacks
- Required for secure cookies

### 5. Payload Size

**Keep payload small:**

- JWT tokens are sent with every request
- Large payloads increase request size
- Only include necessary data (like `userId`)

**❌ BAD:**

```javascript
jwt.sign(
  {
    userId: user._id,
    name: user.name,
    email: user.email,
    address: user.address,
    preferences: user.preferences,
    // ... many more fields
  },
  JWT_SECRET
);
```

**✅ GOOD:**

```javascript
jwt.sign(
  {
    userId: user._id, // Only the identifier
  },
  JWT_SECRET
);

// Fetch full user data from database when needed
```

### 6. Token Validation

**Always validate:**

- Signature verification (prevents tampering)
- Expiration check (prevents use of old tokens)
- Issuer verification (if using `iss` claim)
- Audience verification (if using `aud` claim)

---

## Common Errors and Troubleshooting

### 1. `JsonWebTokenError: invalid signature`

**Cause:** The token signature doesn't match the secret key.

**Possible reasons:**

- Wrong `JWT_SECRET` used for verification
- Token was tampered with
- Secret key was changed after token was issued

**Solution:**

```javascript
// Ensure same secret is used for sign and verify
const token = jwt.sign(payload, JWT_SECRET, options);
const decoded = jwt.verify(token, JWT_SECRET); // Must use same JWT_SECRET
```

### 2. `TokenExpiredError: jwt expired`

**Cause:** The token's `exp` claim indicates it has expired.

**Solution:**

```javascript
// Client needs to get a new token by signing in again
// Or implement refresh token mechanism
```

### 3. `JsonWebTokenError: jwt malformed`

**Cause:** The token format is incorrect (not three parts separated by dots).

**Possible reasons:**

- Token wasn't extracted correctly
- Token was corrupted during transmission
- Empty or invalid token string

**Solution:**

```javascript
// Ensure proper extraction
const token = authHeader.split(" ")[1]; // Correct
// Not: const token = authHeader; // Wrong
```

### 4. `ReferenceError: JWT_SECRET is not defined`

**Cause:** Environment variable not loaded.

**Solution:**

```javascript
// Ensure .env file exists and is loaded
import { config } from "dotenv";
config();

// Or use dotenv/config import
import "dotenv/config";
```

### 5. Token Not Being Sent

**Cause:** Client not including token in request headers.

**Solution:**

```javascript
// Client must include Authorization header
fetch("/api/v1/users/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### 6. `userId` is `undefined` in Controller

**Cause:** Authentication middleware not applied to route.

**Solution:**

```javascript
// Ensure middleware is applied
router.get("/profile", authenticateToken, getUserProfile);
//                                    ^^^^^^^^^^^^^^^^^^
//                                    Must include middleware
```

---

## Advanced Topics

### Decoding Without Verification (Not Recommended)

**⚠️ WARNING:** This should only be used for debugging or reading token contents. Never trust decoded data without verification.

```javascript
import jwt from "jsonwebtoken";

// Decode without verification (unsafe)
const decoded = jwt.decode(token);
// Returns: { userId: "...", iat: ..., exp: ... }

// This does NOT verify signature or expiration!
// Anyone can create a fake token that decodes correctly
```

**Why it's unsafe:**

- Doesn't verify signature (token could be tampered with)
- Doesn't check expiration (expired tokens still decode)
- Should only be used for debugging

### Refresh Tokens

For better security, implement refresh tokens:

```javascript
// Short-lived access token (15 minutes)
const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
  expiresIn: "15m",
});

// Long-lived refresh token (7 days)
const refreshToken = jwt.sign(
  { userId: user._id, type: "refresh" },
  REFRESH_SECRET,
  { expiresIn: "7d" }
);

// Store refresh token in database
await User.findByIdAndUpdate(user._id, { refreshToken });
```

### Multiple Secrets for Different Purposes

```javascript
// Access token secret
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

// Refresh token secret
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Password reset token secret
const RESET_SECRET = process.env.JWT_RESET_SECRET;
```

---

## Summary

### Key Takeaways

1. **`jwt.sign()` creates a token** with:

   - Payload: Your data (`userId`)
   - Secret: Cryptographic key for signing
   - Options: Configuration (expiration, etc.)

2. **Token structure** consists of:

   - Header: Algorithm and type
   - Payload: Your data + standard claims (iat, exp)
   - Signature: Cryptographic proof of authenticity

3. **`jwt.verify()` validates and decodes**:

   - Verifies signature (prevents tampering)
   - Checks expiration
   - Returns decoded payload with `userId`

4. **Security best practices**:

   - Keep secret key secure and long
   - Use HTTPS in production
   - Set appropriate expiration times
   - Store tokens securely (HttpOnly cookies preferred)
   - Never store sensitive data in payload

5. **Complete flow**:
   - Sign up/in → Generate token → Client stores token
   - Authenticated request → Middleware verifies → Extract userId → Process request

---

## References

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken) - Node.js JWT library
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification

---

**Last Updated:** 2024

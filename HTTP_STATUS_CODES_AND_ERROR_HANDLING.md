# HTTP Status Codes and Error Handling in Node.js/Express

## Table of Contents

1. [Introduction](#introduction)
2. [HTTP Status Code Categories](#http-status-code-categories)
3. [Common HTTP Status Codes Explained](#common-http-status-codes-explained)
4. [Error Handling in Express.js](#error-handling-in-expressjs)
5. [next(error) vs throw error](#nexterror-vs-throw-error)
6. [Error Middleware: How It Works](#error-middleware-how-it-works)
7. [How next(error) Reaches Middleware](#how-nexterror-reaches-middleware)
8. [How Error Middleware Saves Your App](#how-error-middleware-saves-your-app)
9. [Best Practices](#best-practices)
10. [Complete Examples](#complete-examples)

---

## Introduction

HTTP status codes are three-digit numbers that indicate the result of an HTTP request. They tell the client whether the request succeeded, failed, or needs further action. In Node.js/Express applications, proper status code usage and error handling are crucial for building robust APIs.

This guide covers:

- The significance of each status code category
- When and how to use specific status codes
- Error handling patterns (`next(error)` vs `throw error`)
- How Express middleware processes errors
- How error middleware prevents application crashes

---

## HTTP Status Code Categories

HTTP status codes are grouped into five categories:

### 1xx: Informational

- **Range**: 100-199
- **Purpose**: Provisional responses, request received, continuing process
- **Usage**: Rarely used in typical REST APIs

### 2xx: Success

- **Range**: 200-299
- **Purpose**: Request successfully received, understood, and accepted
- **Usage**: Most common for successful operations

### 3xx: Redirection

- **Range**: 300-399
- **Purpose**: Further action needed to complete the request
- **Usage**: URL redirections, caching

### 4xx: Client Error

- **Range**: 400-499
- **Purpose**: Client made an error (bad request, unauthorized, etc.)
- **Usage**: Validation errors, authentication failures, not found

### 5xx: Server Error

- **Range**: 500-599
- **Purpose**: Server failed to fulfill a valid request
- **Usage**: Database errors, unexpected exceptions, server failures

---

## Common HTTP Status Codes Explained

### 2xx Success Codes

#### 200 OK

- **Meaning**: Request succeeded
- **When to use**:
  - Successful GET requests
  - Successful PUT/PATCH updates
  - Successful DELETE operations
- **Example**:

```javascript
res.status(200).json({
  success: true,
  message: "User retrieved successfully",
  data: user,
});
```

#### 201 Created

- **Meaning**: Resource successfully created
- **When to use**:
  - After successful POST requests that create new resources
  - User registration
  - Creating new records
- **Example**:

```javascript
res.status(201).json({
  success: true,
  message: "User created successfully",
  data: { user, token },
});
```

#### 204 No Content

- **Meaning**: Request succeeded, but no content to return
- **When to use**:
  - Successful DELETE operations
  - Updates that don't need to return data
- **Example**:

```javascript
res.status(204).send();
```

---

### 4xx Client Error Codes

#### 400 Bad Request

- **Meaning**: Server cannot process the request due to client error
- **When to use**:
  - Invalid request syntax
  - Missing required fields
  - Validation errors
  - Malformed JSON
  - Duplicate entries (sometimes 409 is better)
- **Example**:

```javascript
if (!email || !password) {
  const error = new Error("Email and password are required");
  error.statusCode = 400;
  return next(error);
}
```

#### 401 Unauthorized

- **Meaning**: Authentication required or failed
- **When to use**:
  - Missing or invalid authentication token
  - Wrong password
  - Expired session
  - User not authenticated
- **Example**:

```javascript
if (!isPasswordCorrect) {
  const error = new Error("Invalid password");
  error.statusCode = 401;
  return next(error);
}
```

#### 403 Forbidden

- **Meaning**: Server understood the request but refuses to authorize it
- **When to use**:
  - User authenticated but lacks permission
  - Insufficient privileges
  - Account suspended/banned
- **Example**:

```javascript
if (user.role !== "admin") {
  const error = new Error("Insufficient permissions");
  error.statusCode = 403;
  return next(error);
}
```

#### 404 Not Found

- **Meaning**: Requested resource not found
- **When to use**:
  - User doesn't exist
  - Resource ID doesn't exist
  - Invalid route
  - File not found
- **Example**:

```javascript
if (!user) {
  const error = new Error("User not found");
  error.statusCode = 404;
  return next(error);
}
```

#### 409 Conflict

- **Meaning**: Request conflicts with current state of the server
- **When to use**:
  - Duplicate email/username
  - Resource already exists
  - Concurrent modification conflicts
- **Example**:

```javascript
if (existingUser) {
  const error = new Error("User already exists");
  error.statusCode = 409;
  return next(error);
}
```

#### 422 Unprocessable Entity

- **Meaning**: Request well-formed but semantically incorrect
- **When to use**:
  - Validation errors (more specific than 400)
  - Business logic violations
  - Invalid data format
- **Example**:

```javascript
if (age < 18) {
  const error = new Error("User must be 18 or older");
  error.statusCode = 422;
  return next(error);
}
```

#### 429 Too Many Requests

- **Meaning**: Too many requests in a given time period
- **When to use**:
  - Rate limiting
  - API quota exceeded
- **Example**:

```javascript
if (requestCount > limit) {
  const error = new Error("Too many requests, please try again later");
  error.statusCode = 429;
  return next(error);
}
```

---

### 5xx Server Error Codes

#### 500 Internal Server Error

- **Meaning**: Generic server error, something went wrong
- **When to use**:
  - Unexpected exceptions
  - Database connection failures
  - Unhandled errors
  - Default fallback for unknown errors
- **Example**:

```javascript
catch (error) {
  // Error middleware will default to 500 if statusCode not set
  next(error);
}
```

#### 502 Bad Gateway

- **Meaning**: Server acting as gateway received invalid response
- **When to use**:
  - Upstream server returned invalid response
  - Proxy server issues
- **Example**: Usually handled by infrastructure, not application code

#### 503 Service Unavailable

- **Meaning**: Server temporarily unavailable
- **When to use**:
  - Server maintenance
  - Overloaded server
  - Database unavailable
- **Example**:

```javascript
if (!dbConnection.isConnected()) {
  const error = new Error("Service temporarily unavailable");
  error.statusCode = 503;
  return next(error);
}
```

---

## Error Handling in Express.js

Express.js provides several ways to handle errors:

### 1. Try-Catch Blocks

Used to catch synchronous and asynchronous errors:

```javascript
try {
  const user = await User.findById(userId);
  // ... process user
} catch (error) {
  // Handle error
  next(error);
}
```

### 2. Error Middleware

Special middleware with 4 parameters `(err, req, res, next)`:

```javascript
const errorMiddleware = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};
```

### 3. Promise Rejection Handling

Express can catch unhandled promise rejections (Express 5+ or with `express-async-errors`):

```javascript
// Without try-catch, Express 5+ will catch this
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error("User not found");
  res.json(user);
};
```

---

## next(error) vs throw error

### Understanding next(error)

**`next(error)`** explicitly passes an error to Express error middleware.

**Characteristics:**

- ✅ Explicit error handling
- ✅ Works in all Express versions
- ✅ Must set `error.statusCode` before calling
- ✅ Requires `next` parameter in route handler
- ✅ Can be called conditionally

**Syntax:**

```javascript
export const handler = async (req, res, next) => {
  try {
    // ... code
    if (someCondition) {
      const error = new Error("Something went wrong");
      error.statusCode = 400;
      return next(error); // Explicitly pass to error middleware
    }
  } catch (error) {
    next(error); // Pass caught error to middleware
  }
};
```

**Important:** Always set `statusCode` before calling `next(error)`:

```javascript
// ❌ WRONG - No statusCode set
if (!user) {
  return next(new Error("User not found"));
}

// ✅ CORRECT - statusCode set
if (!user) {
  const error = new Error("User not found");
  error.statusCode = 404;
  return next(error);
}
```

### Understanding throw error

**`throw error`** throws an exception that needs to be caught.

**Characteristics:**

- ✅ Cleaner syntax
- ✅ Works in Express 5+ natively
- ✅ Requires `express-async-errors` package for Express 4
- ✅ Still need to set `error.statusCode`
- ✅ Must be in try-catch or handled by Express

**Syntax:**

```javascript
export const handler = async (req, res) => {
  try {
    // ... code
    if (someCondition) {
      const error = new Error("Something went wrong");
      error.statusCode = 400;
      throw error; // Throw exception
    }
  } catch (error) {
    // Error must be caught and passed to middleware
    next(error);
  }
};
```

**With express-async-errors (Express 4):**

```javascript
import "express-async-errors"; // Import at top of app.js

export const handler = async (req, res) => {
  // No try-catch needed - express-async-errors catches it
  const user = await User.findById(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error; // Express will catch and pass to error middleware
  }
  res.json(user);
};
```

### Comparison Table

| Feature                  | next(error)               | throw error                      |
| ------------------------ | ------------------------- | -------------------------------- |
| **Explicit**             | ✅ Yes                    | ❌ No                            |
| **Express 4**            | ✅ Works                  | ⚠️ Needs express-async-errors    |
| **Express 5+**           | ✅ Works                  | ✅ Works natively                |
| **Requires next param**  | ✅ Yes                    | ❌ No                            |
| **Requires try-catch**   | ⚠️ Only for caught errors | ✅ Yes (or express-async-errors) |
| **Status code required** | ✅ Yes                    | ✅ Yes                           |
| **Code clarity**         | ⚠️ More verbose           | ✅ Cleaner                       |

### When to Use Which?

**Use `next(error)` when:**

- Working with Express 4 without express-async-errors
- You want explicit error handling
- Handling conditional errors (not in try-catch)
- You prefer explicit control flow

**Use `throw error` when:**

- Using Express 5+ or express-async-errors
- You want cleaner code
- Errors are primarily in try-catch blocks
- You prefer exception-based error handling

---

## Error Middleware: How It Works

### What is Error Middleware?

Error middleware is a special Express middleware function that has **4 parameters** instead of the usual 3:

```javascript
// Regular middleware: (req, res, next)
app.use((req, res, next) => {
  // ...
});

// Error middleware: (err, req, res, next)
app.use((err, req, res, next) => {
  // Handle errors
});
```

Express identifies error middleware by the number of parameters. If a middleware has 4 parameters, Express treats it as an error handler.

### Error Middleware Flow

```
Request → Route Handler → Error Occurs → next(error) → Error Middleware → Response
```

### Example Error Middleware

```javascript
const errorMiddleware = (err, req, res, next) => {
  // 1. Create error object
  let error = { ...err };
  error.message = err.message;

  // 2. Log error for debugging
  console.error(err);

  // 3. Handle specific error types
  if (err.name === "CastError") {
    // Mongoose bad ObjectId
    error = new Error("Resource not found");
    error.statusCode = 404;
  }

  if (err.code === 11000) {
    // Mongoose duplicate key
    error = new Error("Duplicate field value entered");
    error.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    // Mongoose validation error
    const message = Object.values(err.errors).map((val) => val.message);
    error = new Error(message.join(", "));
    error.statusCode = 400;
  }

  // 4. Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};
```

### Registering Error Middleware

**Important:** Error middleware must be registered **AFTER** all routes:

```javascript
// app.js
import express from "express";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middlewares.js";

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRouter);

// ✅ CORRECT: Error middleware AFTER routes
app.use(errorMiddleware);

app.listen(3000);
```

**Why after routes?**

- Express processes middleware in order
- Error middleware only catches errors from previous middleware/routes
- If placed before routes, it won't catch route errors

---

## How next(error) Reaches Middleware

### The Journey of an Error

Let's trace how `next(error)` travels from a route handler to error middleware:

#### Step 1: Error Occurs in Route Handler

```javascript
// controllers/auth.controller.js
export const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Error created
      const error = new Error("User not found");
      error.statusCode = 404;

      // next(error) called - passes error to Express
      return next(error);
    }

    // ... rest of code
  } catch (error) {
    // Caught error passed to Express
    next(error);
  }
};
```

#### Step 2: Express Receives the Error

When `next(error)` is called, Express:

1. **Stops** normal middleware execution
2. **Skips** all regular middleware (3-parameter functions)
3. **Jumps** directly to error middleware (4-parameter functions)
4. **Passes** the error as the first parameter

#### Step 3: Error Middleware Processes It

```javascript
// middlewares/error.middlewares.js
const errorMiddleware = (err, req, res, next) => {
  // Express automatically calls this with:
  // err = the error object passed to next(error)
  // req = the request object
  // res = the response object
  // next = next middleware (if any)

  // Process error and send response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};
```

### Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Request Arrives                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Route Handler Executes                          │
│  export const signIn = async (req, res, next) => { ... }    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Error Occurs                              │
│  const error = new Error('User not found');                 │
│  error.statusCode = 404;                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              next(error) Called                              │
│  return next(error);                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         Express Skips Regular Middleware                     │
│  (All 3-parameter middleware skipped)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         Express Finds Error Middleware                       │
│  (First 4-parameter middleware)                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│         Error Middleware Executes                            │
│  errorMiddleware(err, req, res, next)                       │
│  - Processes error                                           │
│  - Sets status code                                         │
│  - Sends JSON response                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Response Sent to Client                         │
│  { success: false, error: "User not found" }                │
│  Status: 404                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Points

1. **`next()` without error**: Continues to next regular middleware
2. **`next(error)`**: Skips all regular middleware, goes to error middleware
3. **Error middleware order matters**: First 4-parameter middleware catches the error
4. **Response must be sent**: Error middleware should send a response or call `next(error)` again

---

## How Error Middleware Saves Your App

### Without Error Middleware: App Crashes

**Scenario:** An unhandled error occurs:

```javascript
// ❌ WITHOUT ERROR MIDDLEWARE
export const signIn = async (req, res) => {
  const user = await User.findOne({ email });
  // If database connection fails, this throws an unhandled error
  // App crashes! 💥

  if (!user) {
    throw new Error("User not found"); // Unhandled exception
    // App crashes! 💥
  }

  res.json(user);
};
```

**What happens:**

1. Error thrown but not caught
2. Express doesn't know how to handle it
3. **Unhandled promise rejection**
4. **Application crashes** or hangs
5. **No response sent** to client
6. **Client waits indefinitely**

### With Error Middleware: Graceful Handling

**Scenario:** Same error, but with error middleware:

```javascript
// ✅ WITH ERROR MIDDLEWARE
export const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error); // Passes to error middleware
    }

    res.json(user);
  } catch (error) {
    next(error); // Passes caught errors to middleware
  }
};

// Error middleware handles it gracefully
const errorMiddleware = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
  // ✅ App continues running
  // ✅ Client receives proper response
  // ✅ Error logged for debugging
};
```

**What happens:**

1. Error caught or passed via `next(error)`
2. Express routes it to error middleware
3. Error middleware processes it
4. **Proper HTTP response sent** to client
5. **App continues running** normally
6. **Error logged** for debugging
7. **Client receives meaningful error message**

### Benefits of Error Middleware

#### 1. **Prevents Application Crashes**

```javascript
// Without middleware: App crashes on unhandled error
// With middleware: Error caught, app continues
```

#### 2. **Consistent Error Responses**

```javascript
// All errors follow same format
{
  success: false,
  error: "Error message"
}
```

#### 3. **Centralized Error Handling**

```javascript
// One place to handle all errors
// Easy to modify error format
// Easy to add logging, monitoring
```

#### 4. **Proper HTTP Status Codes**

```javascript
// Client knows what went wrong
// 404 = Not found
// 401 = Unauthorized
// 500 = Server error
```

#### 5. **Error Logging**

```javascript
const errorMiddleware = (err, req, res, next) => {
  // Log error for debugging
  console.error("Error:", err);

  // Send to error tracking service
  // errorTracker.log(err);

  // Send user-friendly response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};
```

#### 6. **Database Error Handling**

```javascript
const errorMiddleware = (err, req, res, next) => {
  // Handle Mongoose errors
  if (err.name === "CastError") {
    err.statusCode = 404;
    err.message = "Resource not found";
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = "Duplicate entry";
  }

  // Transform database errors into user-friendly messages
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message,
  });
};
```

### Real-World Example

**Without Error Middleware:**

```javascript
// Client makes request
POST /api/v1/auth/sign-in
{ "email": "invalid@email.com" }

// Server crashes 💥
// Client receives: Connection timeout
// Server logs: UnhandledPromiseRejectionWarning
// Application stops responding
```

**With Error Middleware:**

```javascript
// Client makes request
POST /api/v1/auth/sign-in
{ "email": "invalid@email.com" }

// Server handles gracefully ✅
// Client receives:
{
  "success": false,
  "error": "User not found"
}
Status: 404

// Server logs error for debugging
// Application continues running normally
```

---

## Best Practices

### 1. Always Set Status Codes

```javascript
// ❌ BAD
const error = new Error("User not found");
next(error); // Defaults to 500

// ✅ GOOD
const error = new Error("User not found");
error.statusCode = 404;
next(error);
```

### 2. Use Appropriate Status Codes

```javascript
// ✅ Use correct status codes
if (!user) {
  error.statusCode = 404; // Not found
}

if (!isAuthenticated) {
  error.statusCode = 401; // Unauthorized
}

if (!hasPermission) {
  error.statusCode = 403; // Forbidden
}

if (duplicate) {
  error.statusCode = 409; // Conflict
}
```

### 3. Return After next(error)

```javascript
// ✅ GOOD - Prevents further execution
if (!user) {
  const error = new Error("User not found");
  error.statusCode = 404;
  return next(error); // Return prevents code below from running
}

// Code below won't execute if error occurs
res.json(user);
```

### 4. Register Error Middleware Last

```javascript
// ✅ CORRECT ORDER
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use(errorMiddleware); // Last!

// ❌ WRONG - Error middleware before routes
app.use(errorMiddleware);
app.use("/api/v1/auth", authRouter); // Errors here won't be caught
```

### 5. Handle All Error Types

```javascript
const errorMiddleware = (err, req, res, next) => {
  // Handle Mongoose errors
  if (err.name === "CastError") {
    err.statusCode = 404;
  }

  if (err.code === 11000) {
    err.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token";
  }

  // Default to 500 for unknown errors
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};
```

### 6. Log Errors for Debugging

```javascript
const errorMiddleware = (err, req, res, next) => {
  // Log full error details (server-side)
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method,
  });

  // Send user-friendly message (client-side)
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};
```

### 7. Don't Expose Sensitive Information

```javascript
// ❌ BAD - Exposes database details
res.status(500).json({
  error: err.message, // Might contain DB connection strings
});

// ✅ GOOD - Generic message for 500 errors
res.status(err.statusCode || 500).json({
  success: false,
  error: err.statusCode === 500 ? "Server Error" : err.message,
});
```

---

## Complete Examples

### Example 1: Full Authentication Flow

```javascript
// controllers/auth.controller.js
export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      const error = new Error("Name, email, and password are required");
      error.statusCode = 400;
      return next(error);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      return next(error);
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    // Pass any caught errors to middleware
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      return next(error);
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};
```

### Example 2: Comprehensive Error Middleware

```javascript
// middlewares/error.middlewares.js
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    statusCode: err.statusCode,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
    error = new Error(message);
    error.statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new Error(messages.join(", "));
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new Error("Invalid token");
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error = new Error("Token expired");
    error.statusCode = 401;
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
```

### Example 3: App Setup with Error Middleware

```javascript
// app.js
import express from "express";
import { PORT } from "./config/env.js";
import { connectDB } from "./database/mongodb.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middlewares.js";

const app = express();

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Error middleware (MUST be after all routes)
app.use(errorMiddleware);

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

export default app;
```

---

## Summary

### Key Takeaways

1. **HTTP Status Codes**: Use appropriate codes (2xx success, 4xx client errors, 5xx server errors)
2. **next(error)**: Explicitly passes errors to error middleware, requires `statusCode`
3. **throw error**: Throws exceptions, works in Express 5+ or with express-async-errors
4. **Error Middleware**: 4-parameter function that catches all errors
5. **Middleware Order**: Error middleware must be registered after all routes
6. **Error Flow**: `next(error)` → Express skips regular middleware → Error middleware processes → Response sent
7. **App Protection**: Error middleware prevents crashes by catching all errors and sending proper responses

### Remember

- ✅ Always set `error.statusCode` before `next(error)`
- ✅ Register error middleware after all routes
- ✅ Use appropriate HTTP status codes
- ✅ Return after `next(error)` to prevent further execution
- ✅ Log errors for debugging
- ✅ Don't expose sensitive information in error messages

---

**Happy Coding! 🚀**

# RESTful API Comprehensive Guide

## Table of Contents

1. [Introduction to REST](#introduction-to-rest)
2. [Core Principles of REST](#core-principles-of-rest)
3. [HTTP Methods and Their Usage](#http-methods-and-their-usage)
4. [URL Design and Resource Naming](#url-design-and-resource-naming)
5. [HTTP Status Codes](#http-status-codes)
6. [Request and Response Formats](#request-and-response-formats)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Error Handling](#error-handling)
9. [API Versioning](#api-versioning)
10. [Pagination, Filtering, and Sorting](#pagination-filtering-and-sorting)
11. [Rate Limiting](#rate-limiting)
12. [Caching Strategies](#caching-strategies)
13. [Best Practices](#best-practices)
14. [Common Patterns and Anti-patterns](#common-patterns-and-anti-patterns)
15. [Security Considerations](#security-considerations)
16. [Performance Optimization](#performance-optimization)
17. [Testing REST APIs](#testing-rest-apis)
18. [API Documentation](#api-documentation)
19. [Real-World Examples](#real-world-examples)

---

## Introduction to REST

### What is REST?

**REST (Representational State Transfer)** is an architectural style for designing networked applications. It was introduced by Roy Fielding in his 2000 doctoral dissertation. REST is not a protocol or standard, but rather a set of constraints and principles that guide the design of web services.

### Key Characteristics

- **Stateless**: Each request from client to server must contain all the information needed to understand and process the request
- **Client-Server**: Separation of concerns between client and server
- **Cacheable**: Responses must define whether they are cacheable or not
- **Uniform Interface**: Consistent way of interacting with resources
- **Layered System**: Architecture can be composed of hierarchical layers
- **Code on Demand** (optional): Servers can temporarily extend client functionality

### Why REST?

1. **Simplicity**: Uses standard HTTP methods that are well-understood
2. **Scalability**: Stateless nature allows for horizontal scaling
3. **Flexibility**: Works with any data format (JSON, XML, etc.)
4. **Interoperability**: Can be consumed by any client that understands HTTP
5. **Separation of Concerns**: Clear separation between client and server

### REST vs SOAP vs GraphQL

**REST:**

- Uses HTTP methods (GET, POST, PUT, DELETE)
- Stateless
- Resource-based URLs
- JSON/XML responses
- Simple and lightweight

**SOAP:**

- XML-based protocol
- More complex with built-in security
- Requires WSDL for definition
- Heavier than REST

**GraphQL:**

- Query language for APIs
- Single endpoint
- Client specifies exact data needed
- More flexible queries

---

## Core Principles of REST

### 1. Resources

Everything in REST is a **resource**. A resource is any information that can be named and addressed. Resources are identified by URIs (Uniform Resource Identifiers).

**Examples:**

- `/users` - Collection of users
- `/users/123` - Specific user with ID 123
- `/users/123/subscriptions` - Subscriptions belonging to user 123

### 2. Representations

Resources have **representations** - different ways the same resource can be presented. Common formats:

- JSON (most common)
- XML
- HTML
- Plain text

### 3. Stateless Communication

Each request must be independent and contain all necessary information. The server doesn't store client context between requests.

**Stateless Example:**

```http
GET /api/users/123 HTTP/1.1
Authorization: Bearer token123
```

**Stateful (Anti-pattern):**

```http
GET /api/users/123 HTTP/1.1
Session-ID: abc123  # Server must remember this session
```

### 4. Uniform Interface

All resources follow the same interface pattern:

- Consistent URL structure
- Standard HTTP methods
- Standard status codes
- Standard response formats

### 5. HATEOAS (Hypermedia as the Engine of Application State)

Optional principle where responses include links to related resources, allowing clients to discover available actions dynamically.

**Example:**

```json
{
  "id": 123,
  "name": "John Doe",
  "links": {
    "self": "/api/users/123",
    "subscriptions": "/api/users/123/subscriptions",
    "update": "/api/users/123",
    "delete": "/api/users/123"
  }
}
```

---

## HTTP Methods and Their Usage

### GET - Retrieve Resources

**Purpose:** Fetch data without side effects (idempotent and safe)

**Characteristics:**

- Should not modify server state
- Can be cached
- Can be bookmarked
- Parameters in query string

**Examples:**

```http
GET /api/users
GET /api/users/123
GET /api/users?page=1&limit=10
GET /api/users/123/subscriptions
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST - Create Resources

**Purpose:** Create new resources or perform actions

**Characteristics:**

- Not idempotent (multiple calls create multiple resources)
- Not safe (has side effects)
- Request body contains data
- Returns 201 Created on success

**Examples:**

```http
POST /api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secure123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 124,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### PUT - Update/Replace Resources

**Purpose:** Update or replace entire resource

**Characteristics:**

- Idempotent (multiple calls have same effect)
- Not safe
- Replaces entire resource
- Creates resource if it doesn't exist (some implementations)

**Examples:**

```http
PUT /api/users/123
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 123,
    "name": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

### PATCH - Partial Update

**Purpose:** Partially update a resource

**Characteristics:**

- Idempotent (should be)
- Not safe
- Updates only specified fields
- More efficient than PUT for partial updates

**Examples:**

```http
PATCH /api/users/123
Content-Type: application/json

{
  "email": "newemail@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 123,
    "name": "John Updated",
    "email": "newemail@example.com"
  }
}
```

### DELETE - Remove Resources

**Purpose:** Delete a resource

**Characteristics:**

- Idempotent (deleting twice has same effect)
- Not safe
- Usually returns 204 No Content or 200 OK

**Examples:**

```http
DELETE /api/users/123
```

**Response:**

```http
HTTP/1.1 204 No Content
```

or

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### OPTIONS - Preflight Requests

**Purpose:** Get allowed methods for a resource (CORS preflight)

**Example:**

```http
OPTIONS /api/users
```

**Response:**

```http
HTTP/1.1 200 OK
Allow: GET, POST, OPTIONS
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

### HEAD - Get Headers Only

**Purpose:** Get response headers without body (useful for checking if resource exists)

**Example:**

```http
HEAD /api/users/123
```

---

## URL Design and Resource Naming

### Best Practices

#### 1. Use Nouns, Not Verbs

**Good:**

```
GET /api/users
POST /api/users
GET /api/users/123
DELETE /api/users/123
```

**Bad:**

```
GET /api/getUsers
POST /api/createUser
GET /api/getUserById/123
POST /api/deleteUser/123
```

#### 2. Use Plural Nouns for Collections

**Good:**

```
GET /api/users
GET /api/subscriptions
GET /api/products
```

**Bad:**

```
GET /api/user
GET /api/subscription
GET /api/product
```

#### 3. Use Hierarchical Structure

**Good:**

```
GET /api/users/123/subscriptions
GET /api/users/123/subscriptions/456
POST /api/users/123/subscriptions
```

**Bad:**

```
GET /api/userSubscriptions?userId=123
GET /api/subscription/456?userId=123
```

#### 4. Use Hyphens, Not Underscores

**Good:**

```
GET /api/user-profiles
GET /api/subscription-plans
```

**Bad:**

```
GET /api/user_profiles
GET /api/subscription_plans
```

#### 5. Use Lowercase Letters

**Good:**

```
GET /api/users
GET /api/subscription-plans
```

**Bad:**

```
GET /api/Users
GET /api/SubscriptionPlans
```

#### 6. Avoid File Extensions

**Good:**

```
GET /api/users
GET /api/users/123
```

**Bad:**

```
GET /api/users.json
GET /api/users/123.xml
```

#### 7. Use Query Parameters for Filtering, Sorting, Pagination

**Good:**

```
GET /api/users?page=1&limit=10
GET /api/users?status=active&sort=name&order=asc
GET /api/users?search=john&role=admin
```

**Bad:**

```
GET /api/users/page/1/limit/10
GET /api/users/status/active/sort/name
```

### Common URL Patterns

#### Collection Resources

```
GET    /api/users              # List all users
POST   /api/users              # Create new user
```

#### Item Resources

```
GET    /api/users/123          # Get specific user
PUT    /api/users/123          # Replace user
PATCH  /api/users/123          # Partially update user
DELETE /api/users/123          # Delete user
```

#### Sub-resources

```
GET    /api/users/123/subscriptions           # Get user's subscriptions
POST   /api/users/123/subscriptions           # Create subscription for user
GET    /api/users/123/subscriptions/456       # Get specific subscription
DELETE /api/users/123/subscriptions/456       # Delete subscription
```

#### Actions (Use Sparingly)

```
POST /api/users/123/activate
POST /api/subscriptions/456/cancel
POST /api/orders/789/refund
```

---

## HTTP Status Codes

### 2xx Success

#### 200 OK

Standard success response. Used for GET, PUT, PATCH requests.

```json
{
  "success": true,
  "data": { ... }
}
```

#### 201 Created

Resource successfully created. Used for POST requests.

```json
{
  "success": true,
  "message": "Resource created",
  "data": { ... }
}
```

#### 204 No Content

Success with no response body. Commonly used for DELETE requests.

```http
HTTP/1.1 204 No Content
```

#### 202 Accepted

Request accepted but processing not completed. Used for async operations.

```json
{
  "success": true,
  "message": "Request accepted",
  "jobId": "job-123"
}
```

### 3xx Redirection

#### 301 Moved Permanently

Resource permanently moved to new URL.

#### 302 Found (Temporary Redirect)

Resource temporarily moved.

#### 304 Not Modified

Resource not modified since last request (caching).

### 4xx Client Errors

#### 400 Bad Request

Invalid request syntax or parameters.

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "email": "Invalid email format"
    }
  }
}
```

#### 401 Unauthorized

Authentication required or failed.

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

#### 403 Forbidden

Authenticated but not authorized for this resource.

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

#### 404 Not Found

Resource not found.

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 123 not found"
  }
}
```

#### 405 Method Not Allowed

HTTP method not allowed for this resource.

```http
HTTP/1.1 405 Method Not Allowed
Allow: GET, POST
```

#### 409 Conflict

Resource conflict (e.g., duplicate email).

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email already exists"
  }
}
```

#### 422 Unprocessable Entity

Valid syntax but semantic errors (validation errors).

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

#### 429 Too Many Requests

Rate limit exceeded.

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

### 5xx Server Errors

#### 500 Internal Server Error

Generic server error.

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

#### 502 Bad Gateway

Invalid response from upstream server.

#### 503 Service Unavailable

Service temporarily unavailable (maintenance, overload).

```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service temporarily unavailable",
    "retryAfter": 300
  }
}
```

#### 504 Gateway Timeout

Upstream server timeout.

---

## Request and Response Formats

### Request Headers

#### Content-Type

Specifies the media type of the request body.

```http
Content-Type: application/json
Content-Type: application/xml
Content-Type: multipart/form-data
```

#### Accept

Specifies acceptable response media types.

```http
Accept: application/json
Accept: application/json, application/xml
```

#### Authorization

Contains authentication credentials.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Authorization: Basic base64(username:password)
```

#### Custom Headers

Use prefix `X-` for custom headers (though this is being deprecated).

```http
X-API-Key: abc123
X-Request-ID: req-123
```

### Request Body

#### JSON (Most Common)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

#### Form Data

```http
Content-Type: application/x-www-form-urlencoded

name=John+Doe&email=john%40example.com&age=30
```

#### Multipart Form Data

Used for file uploads.

```http
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="name"

John Doe
------WebKitFormBoundary
Content-Disposition: form-data; name="avatar"; filename="avatar.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary--
```

### Response Formats

#### Standard JSON Response Structure

**Success Response:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-123"
  }
}
```

#### Collection Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "User 1"
    },
    {
      "id": 2,
      "name": "User 2"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Response Headers

#### Content-Type

```http
Content-Type: application/json; charset=utf-8
```

#### Cache-Control

```http
Cache-Control: public, max-age=3600
Cache-Control: no-cache, no-store, must-revalidate
```

#### ETag

For cache validation.

```http
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

#### Location

For redirects and created resources.

```http
Location: /api/users/123
```

---

## Authentication and Authorization

### Authentication Methods

#### 1. API Keys

Simple but less secure. Passed in headers or query parameters.

```http
GET /api/users
X-API-Key: abc123def456
```

#### 2. Basic Authentication

Username and password encoded in base64.

```http
GET /api/users
Authorization: Basic base64(username:password)
```

#### 3. Bearer Token (JWT)

Most common for modern APIs. Token passed in Authorization header.

```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. OAuth 2.0

Industry standard for authorization. Uses access tokens.

```http
GET /api/users
Authorization: Bearer access_token_here
```

### Authorization Patterns

#### Role-Based Access Control (RBAC)

Users have roles, roles have permissions.

```javascript
// Example middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: "Forbidden" },
      });
    }
    next();
  };
};

// Usage
router.get("/admin/users", authorize(["admin"]), getUsers);
```

#### Resource-Based Authorization

Check if user owns the resource.

```javascript
const checkOwnership = async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);
  if (resource.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: { message: "Forbidden" },
    });
  }
  next();
};
```

### Security Best Practices

1. **Always use HTTPS** in production
2. **Never expose sensitive data** in URLs
3. **Validate and sanitize** all inputs
4. **Use strong authentication** (JWT with expiration)
5. **Implement rate limiting**
6. **Use CORS** properly
7. **Store passwords** with bcrypt/argon2
8. **Implement token refresh** mechanism
9. **Log security events**
10. **Regular security audits**

---

## Error Handling

### Error Response Structure

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field error"
    },
    "stack": "Error stack (development only)"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-123",
    "path": "/api/users"
  }
}
```

### Error Categories

#### Validation Errors (422)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

#### Authentication Errors (401)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

#### Authorization Errors (403)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to perform this action"
  }
}
```

#### Not Found Errors (404)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

#### Server Errors (500)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### Error Handling Middleware

```javascript
// Error middleware example
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Don't expose stack trace in production
  const error = {
    code: err.code || "INTERNAL_ERROR",
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json({
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
};
```

---

## API Versioning

### Why Version APIs?

1. **Backward Compatibility**: Don't break existing clients
2. **Evolution**: Allow API to evolve over time
3. **Deprecation**: Gracefully deprecate old versions

### Versioning Strategies

#### 1. URL Path Versioning (Most Common)

```
GET /api/v1/users
GET /api/v2/users
```

#### 2. Header Versioning

```http
GET /api/users
Accept: application/vnd.api+json;version=2
```

#### 3. Query Parameter Versioning

```
GET /api/users?version=2
```

#### 4. Subdomain Versioning

```
GET https://v1.api.example.com/users
GET https://v2.api.example.com/users
```

### Versioning Best Practices

1. **Start with v1** (not v0)
2. **Document breaking changes** clearly
3. **Support multiple versions** simultaneously
4. **Deprecate gracefully** with warnings
5. **Set sunset dates** for old versions
6. **Use semantic versioning** concepts (major.minor.patch)

### Deprecation Headers

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 31 Dec 2024 23:59:59 GMT
Link: <https://api.example.com/v2/users>; rel="successor-version"
Warning: 299 - "This API version is deprecated. Please migrate to v2."
```

---

## Pagination, Filtering, and Sorting

### Pagination

#### Offset-Based Pagination

```
GET /api/users?page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Cursor-Based Pagination (Better for Large Datasets)

```
GET /api/users?cursor=eyJpZCI6MTIzfQ&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6MTMzfQ",
    "limit": 10,
    "hasNext": true
  }
}
```

### Filtering

```
GET /api/users?status=active&role=admin
GET /api/users?age[gte]=18&age[lte]=65
GET /api/users?email[contains]=@example.com
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "filters": {
    "status": "active",
    "role": "admin"
  }
}
```

### Sorting

```
GET /api/users?sort=name&order=asc
GET /api/users?sort=-createdAt  # - means descending
GET /api/users?sort=name,email&order=asc,desc
```

### Field Selection

```
GET /api/users?fields=id,name,email
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John",
      "email": "john@example.com"
    }
  ]
}
```

### Search

```
GET /api/users?search=john
GET /api/users?q=john+doe
```

---

## Rate Limiting

### Why Rate Limiting?

1. **Prevent Abuse**: Protect API from excessive requests
2. **Fair Usage**: Ensure fair resource distribution
3. **Cost Control**: Manage infrastructure costs
4. **Security**: Mitigate DDoS attacks

### Rate Limiting Strategies

#### 1. Fixed Window

Limit requests per fixed time window (e.g., 100 requests per minute).

#### 2. Sliding Window

More accurate, tracks requests in rolling time window.

#### 3. Token Bucket

Allows bursts of requests up to bucket capacity.

#### 4. Leaky Bucket

Smooth rate limiting, processes requests at constant rate.

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

### Rate Limit Exceeded Response

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642248000
```

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retryAfter": 60
  }
}
```

### Implementation Example

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);
```

---

## Caching Strategies

### Cache-Control Headers

#### Public Caching

```http
Cache-Control: public, max-age=3600
```

#### Private Caching

```http
Cache-Control: private, max-age=3600
```

#### No Caching

```http
Cache-Control: no-cache, no-store, must-revalidate
```

#### Conditional Requests (ETag)

```http
GET /api/users/123
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# If unchanged:
HTTP/1.1 304 Not Modified
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### Caching Best Practices

1. **Cache GET requests** that return static or slowly-changing data
2. **Don't cache POST/PUT/DELETE** requests
3. **Use ETags** for validation
4. **Set appropriate expiration** times
5. **Invalidate cache** on updates
6. **Use Vary header** for content negotiation

---

## Best Practices

### 1. Use Consistent Naming Conventions

- Plural nouns for collections
- Lowercase with hyphens
- Clear, descriptive names

### 2. Follow HTTP Semantics

- Use correct HTTP methods
- Return appropriate status codes
- Include proper headers

### 3. Provide Clear Error Messages

- Use consistent error format
- Include error codes
- Provide actionable messages

### 4. Implement Proper Security

- Use HTTPS
- Authenticate all requests
- Validate all inputs
- Sanitize outputs

### 5. Version Your API

- Start with v1
- Support multiple versions
- Deprecate gracefully

### 6. Document Thoroughly

- Use OpenAPI/Swagger
- Provide examples
- Document errors
- Include authentication info

### 7. Optimize Performance

- Implement pagination
- Use caching
- Optimize database queries
- Compress responses

### 8. Handle Edge Cases

- Empty collections
- Missing resources
- Invalid inputs
- Server errors

### 9. Use Proper Status Codes

- 200 for success
- 201 for creation
- 204 for deletion
- 400 for bad requests
- 401 for unauthorized
- 403 for forbidden
- 404 for not found
- 500 for server errors

### 10. Implement Logging and Monitoring

- Log all requests
- Track errors
- Monitor performance
- Set up alerts

---

## Common Patterns and Anti-patterns

### Good Patterns

#### 1. Resource-Based URLs

```
GET /api/users/123/subscriptions
```

#### 2. Consistent Response Format

```json
{
  "success": true,
  "data": {...}
}
```

#### 3. Proper Error Handling

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

#### 4. Pagination

```
GET /api/users?page=1&limit=10
```

#### 5. Filtering and Sorting

```
GET /api/users?status=active&sort=name
```

### Anti-patterns to Avoid

#### 1. Using Verbs in URLs

```
❌ POST /api/createUser
✅ POST /api/users
```

#### 2. Inconsistent Naming

```
❌ GET /api/user
   GET /api/subscriptions
✅ GET /api/users
   GET /api/subscriptions
```

#### 3. Returning HTML Errors

```
❌ <html><body>Error 404</body></html>
✅ {"success": false, "error": {"code": "NOT_FOUND"}}
```

#### 4. Ignoring HTTP Methods

```
❌ POST /api/users/123/delete
✅ DELETE /api/users/123
```

#### 5. Exposing Implementation Details

```
❌ {"error": "SQLSyntaxErrorException: Table 'users' doesn't exist"}
✅ {"error": {"code": "INTERNAL_ERROR", "message": "An error occurred"}}
```

#### 6. Not Using Status Codes Properly

```
❌ Always returning 200 OK with error in body
✅ Using appropriate status codes (400, 404, 500, etc.)
```

#### 7. Inconsistent Response Formats

```
❌ Sometimes returning {data: [...]}, sometimes just [...]
✅ Always use consistent format
```

#### 8. Not Handling Edge Cases

```
❌ Assuming data always exists
✅ Check for null/undefined and return 404
```

---

## Security Considerations

### 1. Input Validation

**Always validate and sanitize inputs:**

```javascript
import { body, validationResult } from "express-validator";

const validateUser = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("name").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          details: errors.array(),
        },
      });
    }
    next();
  },
];
```

### 2. SQL Injection Prevention

**Use parameterized queries:**

```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Safe
const query = "SELECT * FROM users WHERE email = ?";
db.query(query, [email]);
```

### 3. XSS Prevention

**Sanitize outputs and use Content Security Policy:**

```javascript
import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
```

### 4. CSRF Protection

**Use CSRF tokens for state-changing operations:**

```javascript
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);
```

### 5. Authentication Security

- Use strong password hashing (bcrypt, argon2)
- Implement token expiration
- Use refresh tokens
- Implement token rotation
- Store tokens securely (httpOnly cookies)

### 6. Authorization Checks

**Always verify permissions:**

```javascript
const checkPermission = async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (resource.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN" },
    });
  }

  next();
};
```

### 7. Rate Limiting

**Prevent abuse with rate limiting:**

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/", limiter);
```

### 8. HTTPS Only

**Always use HTTPS in production:**

```javascript
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 9. Security Headers

**Use security headers:**

```javascript
import helmet from "helmet";

app.use(helmet());
```

### 10. Logging and Monitoring

**Log security events:**

```javascript
const logSecurityEvent = (event, req) => {
  logger.warn({
    event,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    path: req.path,
    timestamp: new Date(),
  });
};
```

---

## Performance Optimization

### 1. Database Optimization

#### Indexing

```javascript
// Create indexes on frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
```

#### Query Optimization

```javascript
// ❌ N+1 Problem
const users = await User.find();
for (const user of users) {
  const subscriptions = await Subscription.find({ userId: user.id });
}

// ✅ Use populate/join
const users = await User.find().populate("subscriptions");
```

#### Pagination

```javascript
// Use limit and skip
const users = await User.find()
  .limit(10)
  .skip((page - 1) * 10);
```

### 2. Caching

#### Response Caching

```javascript
import redis from "redis";

const cache = async (req, res, next) => {
  const key = req.originalUrl;
  const cached = await redis.get(key);

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    redis.setex(key, 3600, JSON.stringify(body));
    res.sendResponse(body);
  };

  next();
};
```

### 3. Compression

```javascript
import compression from "compression";

app.use(compression());
```

### 4. Connection Pooling

```javascript
// MongoDB connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

### 5. Async Operations

```javascript
// Use async/await properly
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
```

### 6. Field Selection

```javascript
// Only select needed fields
const users = await User.find().select("name email");
```

### 7. Batch Operations

```javascript
// Batch insert
await User.insertMany(users);

// Batch update
await User.updateMany({ status: "inactive" }, { $set: { status: "active" } });
```

---

## Testing REST APIs

### Unit Testing

```javascript
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app";

describe("GET /api/users", () => {
  it("should return list of users", async () => {
    const response = await request(app).get("/api/users").expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### Integration Testing

```javascript
describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/users")
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userData.email);
  });

  it("should return 422 for invalid data", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "invalid" })
      .expect(422);

    expect(response.body.success).toBe(false);
  });
});
```

### Test Coverage

- **Happy paths**: Successful operations
- **Error cases**: Invalid inputs, missing resources
- **Edge cases**: Empty collections, boundary values
- **Authentication**: Unauthorized access
- **Authorization**: Permission checks
- **Validation**: Input validation

### Testing Tools

1. **Supertest**: HTTP assertions
2. **Jest/Vitest**: Test framework
3. **Mocha/Chai**: Alternative test framework
4. **Postman/Insomnia**: Manual testing
5. **Newman**: Postman CLI for automation

---

## API Documentation

### OpenAPI/Swagger

```yaml
openapi: 3.0.0
info:
  title: Subscription Tracker API
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: Get all users
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: "#/components/schemas/User"
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateUser"
      responses:
        "201":
          description: User created
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
```

### Documentation Best Practices

1. **Use OpenAPI/Swagger** for interactive docs
2. **Provide examples** for all endpoints
3. **Document all parameters** and their types
4. **Include error responses**
5. **Show authentication** requirements
6. **Provide code samples** in multiple languages
7. **Keep documentation** up to date
8. **Include changelog** for versions

### Tools for Documentation

1. **Swagger/OpenAPI**: Industry standard
2. **Postman**: Collection and documentation
3. **Insomnia**: API client with docs
4. **Redoc**: Beautiful API docs
5. **Slate**: Beautiful static docs

---

## Real-World Examples

### Complete CRUD Example

#### Model

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
```

#### Controller

```javascript
import User from "../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-password");

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "User not found",
        },
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "Email already exists",
        },
      });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "User not found",
        },
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "User not found",
        },
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
```

#### Routes

```javascript
import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateUser } from "../middlewares/validation.middleware.js";

const router = Router();

router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUserById);
router.post("/", validateUser, createUser);
router.put("/:id", authenticate, validateUser, updateUser);
router.patch("/:id", authenticate, validateUser, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
```

#### Error Middleware

```javascript
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation Error";
    const details = {};
    Object.keys(err.errors).forEach((key) => {
      details[key] = err.errors[key].message;
    });

    return res.status(statusCode).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message,
        details,
      },
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    return res.status(statusCode).json({
      success: false,
      error: {
        code: "CONFLICT",
        message: "Resource already exists",
      },
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
};

export default errorHandler;
```

### Authentication Example

#### JWT Authentication

```javascript
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "User not found",
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid token",
        },
      });
    }
    next(error);
  }
};
```

#### Login Controller

```javascript
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        },
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

---

## Conclusion

RESTful APIs are the foundation of modern web development. By following the principles and best practices outlined in this guide, you can create APIs that are:

- **Scalable**: Handle growth and increased load
- **Maintainable**: Easy to understand and modify
- **Secure**: Protect data and prevent abuse
- **Performant**: Fast and efficient
- **Developer-Friendly**: Easy to use and integrate

Remember:

- Use proper HTTP methods and status codes
- Design clear, consistent URLs
- Implement proper error handling
- Secure your API with authentication and authorization
- Document everything thoroughly
- Test comprehensively
- Monitor and optimize performance

Keep learning, stay updated with industry standards, and always prioritize the developer experience when building APIs.

---

## Additional Resources

- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [JSON API Specification](https://jsonapi.org/)

---

_Last Updated: 2024_

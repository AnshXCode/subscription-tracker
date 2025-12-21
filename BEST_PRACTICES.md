# Best Practices

## File Naming Conventions

### Why use `.routes.js` instead of `.js`?

When naming route files, it's recommended to use the pattern `entity.routes.js` (e.g., `users.routes.js`) instead of simply `entity.js` (e.g., `users.js`). Here's why:

#### 1. **Clarity of Purpose**

`users.routes.js` immediately tells you that this file contains route definitions. A file named `users.js` could be anything - routes, controllers, models, services, or utility functions.

#### 2. **Scalability**

As your project grows, you'll likely have multiple files related to the same entity:

- `users.routes.js` - Route definitions
- `users.controller.js` - Controller logic
- `users.model.js` - Data models
- `users.service.js` - Business logic
- `users.middleware.js` - Middleware functions

The suffix makes it immediately clear what each file's purpose is.

#### 3. **Avoiding Naming Conflicts**

Even if files are in different directories, having descriptive suffixes helps avoid confusion when importing or searching for files.

#### 4. **Industry Convention**

This pattern is widely used in Express/Node.js projects, making your codebase easier to navigate and maintain, especially for other developers who are familiar with this convention.

#### Example:

```javascript
// Clear and explicit
import userRoutes from "./routes/users.routes.js";
import userController from "./controllers/users.controller.js";

// vs ambiguous
import users from "./routes/users.js"; // Is this routes? controller? model?
```

This naming convention significantly improves code readability and maintainability, especially as your project scales.

## Environment Variable Naming Conventions

### Why use UPPERCASE_WITH_UNDERSCORES for `.env` variables?

When naming environment variables in `.env` files, it's standard practice to use **UPPERCASE** letters with **UNDERSCORES** (also known as SCREAMING_SNAKE_CASE). Here's why:

#### 1. **Industry Standard**

Environment variables are traditionally written in UPPERCASE across all operating systems and programming languages. This convention makes them immediately recognizable as environment variables.

#### 2. **Distinction from Code Variables**

Using UPPERCASE helps distinguish environment variables from regular code variables:

```javascript
// Environment variable (UPPERCASE)
const dbUrl = process.env.DATABASE_URL;

// Regular code variable (camelCase)
const dbConnection = connect(dbUrl);
```

#### 3. **Cross-Platform Consistency**

Environment variables are case-sensitive on some systems and case-insensitive on others. Using UPPERCASE ensures consistency across platforms.

#### 4. **Readability**

UPPERCASE with underscores makes long variable names easier to read:

- ✅ `DATABASE_CONNECTION_STRING` - Clear and readable
- ❌ `databaseConnectionString` - Harder to scan in `.env` files

### Best Practices for Environment Variable Names

#### Use Descriptive Names

```bash
# ✅ Good - Descriptive and clear
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET_KEY=your-secret-key-here
API_RATE_LIMIT=100

# ❌ Bad - Too short or unclear
DB=postgresql://localhost:5432/mydb
KEY=your-secret-key-here
LIMIT=100
```

#### Group Related Variables with Prefixes

```bash
# ✅ Good - Grouped with prefixes
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secret123

AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1

# ❌ Bad - No grouping
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secret123
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
```

#### Use Underscores for Separation

```bash
# ✅ Good - Clear separation with underscores
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET_KEY=your-secret-key-here
API_BASE_URL=https://api.example.com

# ❌ Bad - Using hyphens (not standard for env vars)
DATABASE-URL=postgresql://localhost:5432/mydb
JWT-SECRET-KEY=your-secret-key-here
API-BASE-URL=https://api.example.com
```

### Example `.env` File Structure

```bash
# Application Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://localhost:5432/mydb
DATABASE_POOL_SIZE=10

# Authentication
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_TIME=24h

# External Services
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secret123

# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=my-bucket
```

Following these naming conventions makes your environment variables consistent, readable, and maintainable across your entire application.

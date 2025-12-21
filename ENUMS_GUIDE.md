# Enums in JavaScript - Complete Guide

## **What is an Enum?**

An **enum** (short for enumeration) is a set of named constants that represent a fixed list of allowed values. It restricts a variable or field to only accept one of the predefined options.

### Real-World Analogy

Think of an enum like a dropdown menu:

- You can only select from the available options
- You can't type in a custom value
- The options are clearly defined and documented

**Example**: A subscription status can only be: `active`, `cancelled`, `expired`, or `pending` - nothing else!

## **JavaScript Doesn't Have Native Enums**

Unlike TypeScript, C#, or Java, JavaScript doesn't have a built-in `enum` keyword. However, you can create enum-like structures using objects, arrays, or constants.

## **Creating Enums in JavaScript**

### Method 1: Object Constants (Most Common)

```javascript
// Define an enum-like object
const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
  GUEST: "guest",
};

// Use it
const currentRole = UserRole.ADMIN;
console.log(currentRole); // 'admin'

// Access all values
console.log(Object.values(UserRole));
// ['admin', 'user', 'moderator', 'guest']
```

**Pros:**

- Clear and readable
- Easy to use with autocomplete
- Can access both keys and values

**Cons:**

- Can be modified accidentally (unless frozen)

### Method 2: Object.freeze() for Immutability

```javascript
// Create a frozen enum (cannot be modified)
const SubscriptionStatus = Object.freeze({
  ACTIVE: "active",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  PENDING: "pending",
});

// Now it's read-only
SubscriptionStatus.ACTIVE = "changed"; // Won't work (silently ignored)
console.log(SubscriptionStatus.ACTIVE); // Still 'active'

// Try to add new property
SubscriptionStatus.NEW_STATUS = "new"; // Won't work
```

**Pros:**

- Prevents accidental modification
- More robust and safe
- Recommended for production code

**Cons:**

- Slightly more verbose

### Method 3: Using Arrays (Simple but Less Safe)

```javascript
// Simple array enum
const SubscriptionPlans = ["basic", "premium", "enterprise"];

// Check if value is valid
if (SubscriptionPlans.includes("premium")) {
  console.log("Valid plan");
}
```

**Pros:**

- Very simple
- Easy to check membership

**Cons:**

- No named constants (can't do `SubscriptionPlans.PREMIUM`)
- Can be modified easily
- Less type-safe

### Method 4: Using Symbol (Advanced)

```javascript
// Using Symbols for truly unique values
const SubscriptionStatus = Object.freeze({
  ACTIVE: Symbol("active"),
  CANCELLED: Symbol("cancelled"),
  EXPIRED: Symbol("expired"),
});

// Symbols are always unique
const status = SubscriptionStatus.ACTIVE;
console.log(status === SubscriptionStatus.ACTIVE); // true
```

**Pros:**

- Values are guaranteed unique
- Can't be confused with strings

**Cons:**

- More complex
- Harder to serialize (can't convert to JSON easily)
- Usually overkill for most use cases

## **Enums in Mongoose Schemas**

Mongoose provides built-in `enum` validation for schema fields. This is the most common use case in your subscription tracker project.

### Basic Usage

```javascript
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["active", "cancelled", "expired", "pending"],
    default: "pending",
  },
  plan: {
    type: String,
    enum: ["basic", "premium", "enterprise"],
    required: true,
  },
});
```

### Combining with Object Constants

```javascript
// Define enums as constants
const SubscriptionStatus = Object.freeze({
  ACTIVE: "active",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  PENDING: "pending",
});

const SubscriptionPlan = Object.freeze({
  BASIC: "basic",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
});

// Use in schema
const subscriptionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.PENDING,
  },
  plan: {
    type: String,
    enum: Object.values(SubscriptionPlan),
    required: true,
  },
});
```

### Validation Example

```javascript
// ✅ Valid - will save successfully
const subscription = await Subscription.create({
  status: SubscriptionStatus.ACTIVE,
  plan: SubscriptionPlan.PREMIUM,
});

// ❌ Invalid - will throw validation error
try {
  const badSubscription = await Subscription.create({
    status: "invalid_status", // Not in enum!
    plan: SubscriptionPlan.BASIC,
  });
} catch (error) {
  console.error(error.message);
  // "`status` is not a valid enum value"
}
```

## **Practical Example: Subscription Tracker**

Here's how you could implement enums in your subscription tracker:

### Step 1: Create Enum Constants File

Create `constants/enums.js`:

```javascript
// Subscription Status Enum
export const SubscriptionStatus = Object.freeze({
  ACTIVE: "active",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  PENDING: "pending",
  TRIAL: "trial",
});

// Subscription Plan Enum
export const SubscriptionPlan = Object.freeze({
  BASIC: "basic",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
  FREE: "free",
});

// Payment Method Enum
export const PaymentMethod = Object.freeze({
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  CRYPTO: "crypto",
});

// Billing Cycle Enum
export const BillingCycle = Object.freeze({
  MONTHLY: "monthly",
  YEARLY: "yearly",
  LIFETIME: "lifetime",
  WEEKLY: "weekly",
});
```

### Step 2: Use in Models

```javascript
// models/subscription.model.js
import mongoose from "mongoose";
import {
  SubscriptionStatus,
  SubscriptionPlan,
  PaymentMethod,
  BillingCycle,
} from "../constants/enums.js";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
      required: true,
    },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      required: true,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      default: BillingCycle.MONTHLY,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
```

### Step 3: Use in Routes/Controllers

```javascript
// routes/subscriptions.routes.js
import { Router } from "express";
import Subscription from "../models/subscription.model.js";
import { SubscriptionStatus, SubscriptionPlan } from "../constants/enums.js";

const router = Router();

// Create subscription
router.post("/", async (req, res) => {
  try {
    const subscription = await Subscription.create({
      userId: req.body.userId,
      status: SubscriptionStatus.ACTIVE, // Using enum constant
      plan: SubscriptionPlan.PREMIUM, // Using enum constant
      paymentMethod: req.body.paymentMethod,
    });
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Filter by status
router.get("/active", async (req, res) => {
  const activeSubscriptions = await Subscription.find({
    status: SubscriptionStatus.ACTIVE, // Consistent enum usage
  });
  res.json(activeSubscriptions);
});

export default router;
```

## **Benefits of Using Enums**

### 1. **Type Safety**

Prevents typos and invalid values:

```javascript
// ❌ Without enum - typo possible
status: "actve"; // Typo! Won't be caught until runtime

// ✅ With enum - typo caught immediately
status: SubscriptionStatus.ACTIVE; // Autocomplete helps prevent typos
```

### 2. **Self-Documenting Code**

Makes allowed values explicit:

```javascript
// Clear what values are allowed
enum: Object.values(SubscriptionStatus);
```

### 3. **IDE Autocomplete**

Modern IDEs can autocomplete enum values:

```javascript
SubscriptionStatus.  // IDE shows: ACTIVE, CANCELLED, EXPIRED, PENDING
```

### 4. **Refactoring Safety**

Change values in one place:

```javascript
// Change 'active' to 'activated' everywhere by updating one constant
const SubscriptionStatus = Object.freeze({
  ACTIVE: "activated", // Changed here
  // ...
});
```

### 5. **Validation**

Mongoose automatically validates enum values:

```javascript
// Mongoose rejects invalid values automatically
await Subscription.create({ status: "invalid" });
// Throws validation error
```

### 6. **Consistency**

Ensures same values used throughout the application:

```javascript
// All parts of your app use the same values
if (subscription.status === SubscriptionStatus.ACTIVE) { ... }
```

## **Common Patterns**

### Pattern 1: Checking Enum Membership

```javascript
// Check if value is valid enum value
function isValidStatus(status) {
  return Object.values(SubscriptionStatus).includes(status);
}

if (isValidStatus(req.body.status)) {
  // Process valid status
}
```

### Pattern 2: Getting All Enum Values

```javascript
// Get all possible statuses
const allStatuses = Object.values(SubscriptionStatus);
// ['active', 'cancelled', 'expired', 'pending']

// Get all enum keys
const allKeys = Object.keys(SubscriptionStatus);
// ['ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING']
```

### Pattern 3: Enum Mapping

```javascript
// Map enum values to display names
const StatusDisplayNames = {
  [SubscriptionStatus.ACTIVE]: "Active Subscription",
  [SubscriptionStatus.CANCELLED]: "Cancelled",
  [SubscriptionStatus.EXPIRED]: "Expired",
  [SubscriptionStatus.PENDING]: "Pending Activation",
};

console.log(StatusDisplayNames[SubscriptionStatus.ACTIVE]);
// 'Active Subscription'
```

### Pattern 4: Enum with Metadata

```javascript
// More complex enum with additional info
const SubscriptionPlan = Object.freeze({
  BASIC: {
    value: "basic",
    price: 9.99,
    features: ["feature1", "feature2"],
  },
  PREMIUM: {
    value: "premium",
    price: 19.99,
    features: ["feature1", "feature2", "feature3"],
  },
});

// Use in schema
const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: Object.values(SubscriptionPlan).map((p) => p.value),
  },
});
```

## **Best Practices**

### ✅ DO

1. **Use `Object.freeze()`** to prevent modification
2. **Export enums from a constants file** for reusability
3. **Use descriptive names** (e.g., `SubscriptionStatus` not `Status`)
4. **Use UPPERCASE for enum keys** (convention)
5. **Use lowercase for enum values** (when used in databases)
6. **Document enum purpose** with comments

```javascript
/**
 * Subscription status values
 * Used to track the current state of a subscription
 */
export const SubscriptionStatus = Object.freeze({
  ACTIVE: "active", // Subscription is active and paid
  CANCELLED: "cancelled", // User cancelled subscription
  EXPIRED: "expired", // Subscription expired (not renewed)
  PENDING: "pending", // Awaiting payment confirmation
});
```

### ❌ DON'T

1. **Don't use magic strings** - always use enum constants
2. **Don't modify frozen enums** - create new ones if needed
3. **Don't mix enum styles** - be consistent across your codebase
4. **Don't create enums for everything** - only for fixed sets of values

```javascript
// ❌ Bad - magic strings
if (subscription.status === 'active') { ... }

// ✅ Good - enum constant
if (subscription.status === SubscriptionStatus.ACTIVE) { ... }
```

## **When to Use Enums**

Use enums when you have:

- ✅ A fixed set of values (status, role, category)
- ✅ Values that won't change frequently
- ✅ Need for validation (database, API)
- ✅ Need for consistency across codebase

Don't use enums for:

- ❌ Values that change frequently
- ❌ User-generated content
- ❌ Dynamic lists
- ❌ Values that need to be configurable

## **Summary**

- **Enum** = A fixed set of named constants
- JavaScript doesn't have native enums, but you can create them with objects
- Use `Object.freeze()` to make enums immutable
- Mongoose `enum` validates field values automatically
- Enums provide type safety, consistency, and self-documentation
- Export enums from a constants file for reusability
- Use enum constants instead of magic strings throughout your code

## **Quick Reference**

```javascript
// Create enum
const MyEnum = Object.freeze({
  KEY1: "value1",
  KEY2: "value2",
});

// Use in Mongoose
enum: Object.values(MyEnum);

// Use in code
const value = MyEnum.KEY1;

// Check membership
Object.values(MyEnum).includes(value);

// Get all values
Object.values(MyEnum); // ['value1', 'value2']
```

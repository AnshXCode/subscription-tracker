# Database Models and Schemas Documentation

## **Database Model**

A **database model** is a JavaScript class/object that represents a collection in MongoDB. It provides methods to interact with the database (create, read, update, delete).

In your code:

- `User` (line 27 in `user.model.js`) is the model — it's what you use to interact with the `users` collection
- You'd use it like: `User.create()`, `User.find()`, `User.findById()`, etc.

## **Schema**

A **schema** defines the structure, validation rules, and behavior of documents in a collection. It's the blueprint that describes:

- What fields exist
- What data types they are
- Validation rules (required, min length, etc.)
- Default values
- Relationships to other collections

In your `user.model.js`:

- `userSchema` (lines 3-25) defines the schema
- It specifies that a user must have:
  - `name` (String, required, trimmed)
  - `email` (String, required, unique, must match email format)
  - `password` (String, required, min 8 characters)
- It also adds `timestamps: true`, which automatically adds `createdAt` and `updatedAt` fields

## **The Relationship**

```
Schema → defines structure → Model → interacts with database
```

1. **Schema**: blueprint (what data looks like)
2. **Model**: tool built from schema (how you interact with data)

Think of it like:

- **Schema** = architectural blueprint of a house
- **Model** = the actual house you can live in and use

In your code, `mongoose.model('User', userSchema)` creates the `User` model from the `userSchema`, which you then use throughout your application to work with user data in MongoDB.

## **Example from Your Codebase**

### User Model (`models/user.model.js`)

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
```

**Key Points:**

- `userSchema` is the schema definition
- `User` is the model created from the schema
- The schema includes validation rules (required, minlength, match patterns)
- `timestamps: true` automatically adds `createdAt` and `updatedAt` fields

### Subscription Model (`models/subscription.model.js`)

```javascript
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
```

**Key Points:**

- `subscriptionSchema` defines the subscription structure
- `userId` references the `User` model (relationship between collections)
- `ref: 'User'` tells Mongoose which model to populate when using `.populate()`

## **Common Schema Options**

### Field Types

- `String` - Text data
- `Number` - Numeric data
- `Date` - Date/time data
- `Boolean` - True/false values
- `ObjectId` - References to other documents
- `Array` - Lists of values
- `Object` - Nested objects

### Validation Options

- `required: true` - Field must be provided
- `unique: true` - Field value must be unique across collection
- `minlength` / `maxlength` - String length constraints
- `min` / `max` - Number range constraints
- `match: [regex, message]` - Pattern matching for strings
- `enum: [values]` - Field must be one of the specified values
- `default: value` - Default value if not provided

### Schema Options

- `timestamps: true` - Automatically adds `createdAt` and `updatedAt` fields
- `collection: 'name'` - Custom collection name (defaults to pluralized model name)
- `strict: true/false` - Whether to allow fields not defined in schema

## **Using Models in Your Application**

Once you have a model, you can use it to interact with the database:

```javascript
import User from "./models/user.model.js";

// Create a new user
const newUser = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: "securepassword123",
});

// Find users
const users = await User.find();
const user = await User.findById(userId);
const userByEmail = await User.findOne({ email: "john@example.com" });

// Update a user
await User.findByIdAndUpdate(userId, { name: "Jane Doe" });

// Delete a user
await User.findByIdAndDelete(userId);
```

## **Summary**

- **Schema** = Definition/Blueprint of your data structure
- **Model** = JavaScript class that uses the schema to interact with MongoDB
- Schema defines **what** your data looks like
- Model provides **how** you work with that data in your application

---

# Database Clusters and MongoDB Atlas

## **What is a Database Cluster?**

A **database cluster** is a group of database servers (nodes) that work together to store and manage your data. Instead of having a single database server, a cluster distributes data across multiple servers for:

- **High Availability**: If one server fails, others can take over
- **Performance**: Multiple servers can handle requests simultaneously
- **Scalability**: Can add more servers as your data grows
- **Data Redundancy**: Data is replicated across servers for safety

### **Simple Analogy**

Think of a cluster like a library system:

- **Single Server** = One library building (if it closes, no access to books)
- **Cluster** = Multiple library branches (if one closes, others are still open; more people can access books simultaneously)

## **MongoDB Atlas Clusters**

When you set up MongoDB Atlas (MongoDB's cloud service), it automatically creates a **cluster** for you. This cluster consists of:

### **1. Primary Node (Primary Replica)**

- Handles all write operations
- Handles read operations
- If it fails, one of the secondary nodes is automatically promoted to primary

### **2. Secondary Nodes (Replica Set Members)**

- Keep copies of your data (replication)
- Can handle read operations (read scaling)
- Automatically take over if primary fails (automatic failover)

### **Basic Cluster Structure**

```
┌─────────────────────────────────────┐
│      MongoDB Atlas Cluster          │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │ Primary  │◄───┤Secondary │      │
│  │  Node    │    │  Node    │      │
│  └────┬─────┘    └────┬─────┘      │
│       │               │            │
│       └───────┬───────┘            │
│               │                    │
│         ┌─────▼─────┐              │
│         │ Secondary │              │
│         │   Node    │              │
│         └───────────┘              │
│                                     │
│  All nodes sync data automatically  │
└─────────────────────────────────────┘
```

## **What MongoDB Atlas Gives You**

When MongoDB Atlas allocated you a cluster, it provided:

1. **Managed Infrastructure**: MongoDB handles server setup, updates, and maintenance
2. **Automatic Backups**: Regular backups of your data
3. **Replication**: Your data is automatically copied to multiple servers
4. **High Availability**: Automatic failover if a server goes down
5. **Connection String**: A `DB_URL` (like `mongodb+srv://...`) that connects to your cluster

### **Your Connection**

In your `database/mongodb.js`, when you connect using `mongoose.connect(DB_URL)`, you're connecting to your MongoDB Atlas cluster. The connection string looks something like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

This URL points to your cluster, and MongoDB automatically routes your requests to the appropriate node.

## **Horizontal Scaling in MongoDB**

### **Does MongoDB Scale Horizontally Automatically?**

**Short Answer**: MongoDB Atlas provides the infrastructure for horizontal scaling, but it's **semi-automatic** - you configure it, and MongoDB handles the rest.

### **Types of Scaling**

#### **1. Vertical Scaling (Scaling Up)**

- **What**: Increase resources (CPU, RAM, storage) on existing servers
- **MongoDB Atlas**: You can upgrade your cluster tier (e.g., M0 → M10 → M30)
- **Automatic**: No, you manually upgrade your cluster tier
- **Example**: Moving from 2GB RAM to 8GB RAM on the same server

#### **2. Horizontal Scaling (Scaling Out)**

- **What**: Add more servers to your cluster
- **MongoDB Atlas**: You can add shards or increase replica set members
- **Automatic**: Partially - MongoDB handles data distribution, but you configure when to scale
- **Example**: Adding more servers to handle increased load

### **MongoDB Atlas Scaling Features**

#### **A. Replica Sets (Automatic Replication)**

- **What**: Multiple copies of your data across nodes
- **Automatic**: Yes! MongoDB automatically replicates data to secondary nodes
- **Benefit**: High availability and read scaling

#### **B. Sharding (Manual Configuration)**

- **What**: Distributes data across multiple servers (shards)
- **Automatic**: No, you need to enable and configure sharding
- **When**: Needed when single cluster can't handle data size or load
- **Benefit**: Can handle massive datasets and high throughput

#### **C. Auto-Scaling (Atlas Feature)**

- **What**: Automatically adjusts cluster resources based on usage
- **Automatic**: Yes, if enabled in Atlas settings
- **How**: Atlas monitors your usage and scales up/down within configured limits
- **Benefit**: Pay only for what you use, scales automatically

### **What Happens Automatically**

✅ **Automatic**:

- Data replication to secondary nodes
- Failover (if primary fails, secondary becomes primary)
- Load balancing read requests across replicas
- Connection management and routing
- Health monitoring and alerts

❌ **Manual Configuration Required**:

- Enabling sharding
- Setting up auto-scaling policies
- Upgrading cluster tiers
- Adding/removing shards

## **Your Current Setup**

Based on your `database/mongodb.js`:

```javascript
await mongoose.connect(DB_URL);
```

You're connecting to a MongoDB Atlas cluster. This cluster likely has:

1. **M0 (Free Tier)** or **M10+ (Paid Tier)** cluster
2. **3-node replica set** (1 primary + 2 secondaries) - standard setup
3. **Automatic replication** - your data is copied across all nodes
4. **Automatic failover** - if primary fails, a secondary takes over

### **What This Means for You**

- ✅ **High Availability**: Your database stays online even if a server fails
- ✅ **Data Safety**: Your data is replicated automatically
- ✅ **Read Performance**: Can distribute read queries across multiple nodes
- ⚠️ **Write Performance**: Still goes through primary (single point for writes)
- ⚠️ **Scaling**: For significant growth, you may need to enable sharding or upgrade tiers

## **When to Scale Horizontally**

Consider horizontal scaling (sharding) when:

1. **Data Size**: Your database exceeds single server storage capacity
2. **Write Load**: Write operations become a bottleneck
3. **Geographic Distribution**: Need data closer to users in different regions
4. **Performance**: Single cluster can't handle query load

For most applications, a replica set (what you have) is sufficient until you reach significant scale.

## **Summary**

- **Cluster** = Group of database servers working together
- **MongoDB Atlas** = Managed MongoDB service that provides clusters
- **Replication** = Automatic copying of data across nodes (automatic)
- **Horizontal Scaling** = Adding more servers (semi-automatic - you configure, MongoDB handles distribution)
- **Auto-Scaling** = Atlas feature that adjusts resources automatically (if enabled)
- Your cluster provides **high availability** and **data redundancy** out of the box

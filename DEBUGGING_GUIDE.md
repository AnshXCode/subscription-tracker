# Debugging Guide: How to Debug API Issues

## The Systematic Debugging Process

When your API endpoint isn't working, follow these steps in order:

---

## Step 1: Understand the Error Message

**What to do:**

- Check the Postman response (status code, error message)
- Check your server console/terminal for error logs
- Look at the Network tab in browser DevTools (if using browser)

**Questions to ask:**

- What is the exact error message?
- What is the HTTP status code? (200, 400, 500, etc.)
- Is there a stack trace?

**Example:**

- Status: 500 Internal Server Error
- Message: "Cannot read property 'email' of undefined"
- This tells you: `req.body` is likely undefined

---

## Step 2: Trace the Request Flow

**Follow the path of your request:**

```
Postman Request
    ↓
Express App (app.js)
    ↓
Route Handler (routes/auth.routes.js)
    ↓
Controller Function (controllers/auth.controller.js)
    ↓
Database Operations
    ↓
Response
```

**Check each step:**

### 2.1 Is the route registered?

- Look at `app.js` - is your route middleware added?
- Is the path correct? (`/api/v1/auth/sign-up`)

### 2.2 Is the request reaching the controller?

- Add a `console.log('Request received')` at the start of your controller
- If you don't see it, the route isn't matching

### 2.3 Is the request body being parsed?

- Add `console.log('req.body:', req.body)` in your controller
- If it's `undefined` or `{}`, middleware is missing

---

## Step 3: Check Middleware Order

**Critical rule:** Middleware executes in the order it's registered!

**Common issues:**

1. **Missing `express.json()`** → `req.body` will be `undefined`
2. **Error middleware not last** → Errors won't be caught properly
3. **Routes before body parser** → Routes won't have parsed bodies

**Checklist:**

```javascript
// ✅ Correct order:
app.use(express.json()); // 1. Parse JSON bodies
app.use("/api/v1/auth", authRouter); // 2. Register routes
app.use(errorMiddleware); // 3. Error handler LAST
```

---

## Step 4: Add Strategic Console Logs

**Add logs at key points:**

```javascript
export const signUp = async (req, res, next) => {
  console.log("1. Function called");
  console.log("2. req.body:", req.body);

  const { name, email, password } = req.body;
  console.log("3. Destructured:", { name, email, password });

  // ... rest of code
};
```

**What to look for:**

- If log #1 doesn't appear → Route not matching
- If log #2 shows `undefined` → Missing body parser middleware
- If log #3 shows `undefined` values → Body structure mismatch

---

## Step 5: Verify Request Format in Postman

**Check these in Postman:**

1. **HTTP Method:** Is it `POST`? (not GET)
2. **URL:** Is it correct? `http://localhost:3000/api/v1/auth/sign-up`
3. **Headers:**
   - `Content-Type: application/json` (required for JSON bodies)
4. **Body tab:**
   - Select "raw" and "JSON"
   - Format: `{ "name": "Test", "email": "test@test.com", "password": "password123" }`

---

## Step 6: Check Database Connection

**Verify:**

- Is MongoDB running?
- Is the connection string correct in `.env`?
- Check server startup logs for "Connected to MongoDB"

**Add connection check:**

```javascript
console.log("Mongoose connection state:", mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
```

---

## Step 7: Validate Data Flow

**For each variable, ask:**

- Where does it come from?
- What should it contain?
- Is it being used correctly?

**Example for `req.body`:**

```javascript
// Step 1: Check if it exists
console.log("req.body exists?", !!req.body);

// Step 2: Check its structure
console.log("req.body keys:", Object.keys(req.body || {}));

// Step 3: Check individual values
const { name, email, password } = req.body;
console.log("name:", name, "email:", email, "password:", password);
```

---

## Step 8: Check Error Handling

**Verify error middleware:**

- Is it registered in `app.js`?
- Is it the LAST middleware?
- Does it handle your error types?

**Test error handling:**

```javascript
// In your controller, try:
throw new Error("Test error");
// Does it get caught and formatted correctly?
```

---

## Step 9: Use Node.js Debugger

**Start your server with debugger:**

```bash
node --inspect app.js
```

**In VS Code:**

1. Go to Run & Debug
2. Create launch.json:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug App",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}/app.js"
}
```

3. Set breakpoints in your controller
4. Step through code line by line

---

## Step 10: Check Transaction/Session Usage

**For Mongoose transactions:**

- Are operations using the session?
- Is the session passed correctly?
- Are transactions committed/aborted properly?

**Common mistake:**

```javascript
// ❌ Wrong - operation not in transaction
const user = await User.create({ name, email, password });

// ✅ Correct - operation in transaction
const user = await User.create({ name, email, password }, { session });
```

---

## Quick Debugging Checklist

When your API isn't working, check:

- [ ] Server is running (check terminal)
- [ ] Route path matches Postman URL
- [ ] HTTP method matches (GET/POST/PUT/DELETE)
- [ ] `express.json()` middleware is registered
- [ ] `Content-Type: application/json` header in Postman
- [ ] Request body is valid JSON
- [ ] Database is connected
- [ ] Error middleware is registered (and last)
- [ ] Console logs show expected values
- [ ] No syntax errors (check terminal)

---

## Practice Exercise

**Try this yourself:**

1. Temporarily remove `express.json()` from `app.js`
2. Make a request in Postman
3. Add `console.log(req.body)` in controller
4. See what happens - `req.body` will be `undefined`
5. Add `express.json()` back
6. Make request again - now it works!

**This teaches you:**

- How middleware affects request processing
- How to verify data flow
- The importance of middleware order

---

## Common Issues & Solutions

| Issue                       | Symptom                       | Solution                             |
| --------------------------- | ----------------------------- | ------------------------------------ |
| Missing `express.json()`    | `req.body` is `undefined`     | Add `app.use(express.json())`        |
| Wrong route path            | 404 Not Found                 | Check route registration and URL     |
| Wrong HTTP method           | 404 or method not allowed     | Check method in Postman              |
| Missing Content-Type header | Body not parsed               | Add `Content-Type: application/json` |
| Error middleware not last   | Errors not caught             | Move error middleware after routes   |
| Database not connected      | DB operations fail            | Check connection string and MongoDB  |
| Transaction without session | Operations not in transaction | Pass `{ session }` to operations     |

---

## Next Steps

1. **Practice:** Remove one thing at a time and see what breaks
2. **Add logs:** Get comfortable with strategic console.logs
3. **Read errors:** Error messages usually tell you exactly what's wrong
4. **Use debugger:** Step through code to see values at each step
5. **Test incrementally:** Test each piece separately

Remember: **Most bugs are simple mistakes** - missing middleware, typos, wrong order. Systematic checking will find them!

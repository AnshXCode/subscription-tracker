# Debugging Exercise: Your Sign-Up Endpoint

Let's debug your Postman request together. Answer these questions step by step.

---

## Step 1: What Error Are You Seeing?

**Question 1:** When you make the POST request in Postman, what happens?

**Check:**

- [ ] What HTTP status code do you get? (200, 400, 404, 500?)
- [ ] What is the response body?
- [ ] What appears in your server terminal/console?

**Write down your answers here:**

```
Status Code: _______
Response Body: _______
Server Console Output: _______
```
hey buddy
---

## Step 2: Is the Request Reaching Your Controller?

**Exercise:** Add this log at the very beginning of your `signUp` function:

```javascript
export const signUp = async (req, res, next) => {
  console.log("🔵 SIGNUP FUNCTION CALLED");
  // ... rest of your code
};
```

**Question 2:** After adding this log and making a request:

- [ ] Do you see "🔵 SIGNUP FUNCTION CALLED" in your terminal?
  - **YES** → The route is working, move to Step 3
  - **NO** → The route isn't matching. Check:
    - Is your server running?
    - Is the URL correct in Postman?
    - Is the route registered in `app.js`?

---

## Step 3: Is the Request Body Being Received?

**Exercise:** Add this log right after the function starts:

```javascript
export const signUp = async (req, res, next) => {
  console.log("🔵 SIGNUP FUNCTION CALLED");
  console.log("🟢 req.body:", req.body);
  console.log("🟢 req.body type:", typeof req.body);
  // ... rest of your code
};
```

**Question 3:** What do these logs show?

- [ ] `req.body` is `undefined` → **Problem found!** Go to Step 4
- [ ] `req.body` is `{}` (empty object) → Check Postman body format
- [ ] `req.body` has your data → Move to Step 5

**If `req.body` is undefined, think about:**

- What middleware is needed to parse JSON request bodies?
- Is that middleware registered in `app.js`?
- What is the middleware called? (Hint: `express._____()`)

---

## Step 4: Check Middleware Registration

**Exercise:** Look at your `app.js` file.

**Question 4:** Do you see this line anywhere?

```javascript
app.use(express.json());
```

- [ ] **YES, I see it** → Check if it's BEFORE your routes
- [ ] **NO, I don't see it** → **Found the problem!** Add it before your routes

**Question 5:** What order are things in `app.js`?

The correct order should be:

1. `express.json()` - Parse request bodies
2. Your routes - Handle requests
3. Error middleware - Handle errors (LAST)

Is your `app.js` in this order?

---

## Step 5: Check Postman Request Format

**Question 6:** In Postman, verify:

1. **Method:** Is it set to `POST`? (not GET)

   - [ ] Yes
   - [ ] No → Change it!

2. **URL:** What is the full URL?

   - Should be: `http://localhost:<YOUR_PORT>/api/v1/auth/sign-up`
   - [ ] Matches this format
   - [ ] Different → Fix it!

3. **Headers:** Do you have `Content-Type` header?

   - [ ] Yes, set to `application/json`
   - [ ] No → Add it!
   - [ ] Yes, but different value → Change to `application/json`

4. **Body:**
   - [ ] Body tab selected?
   - [ ] "raw" option selected?
   - [ ] "JSON" selected (dropdown next to raw)?
   - [ ] Body looks like: `{ "name": "...", "email": "...", "password": "..." }`

---

## Step 6: Check Database Operations

**Question 7:** If `req.body` is working, check your database operations.

Add logs:

```javascript
const { name, email, password } = req.body;
console.log("🟡 Extracted:", { name, email, password });

const existingUser = await User.findOne({ email }).session(session);
console.log("🟡 Existing user:", existingUser);
```

**What do you see?**

- If you get an error here, check:
  - Is MongoDB running?
  - Is the connection string correct?
  - Check your `database/mongodb.js` file

---

## Step 7: Check Transaction Usage

**Question 8:** Look at your `User.findOne()` and `User.create()` calls.

**Do they include the session?**

```javascript
// Should be:
User.findOne({ email }).session(session)  // ✅ Has .session(session)
User.create({ ... }, { session })         // ✅ Has { session }
```

**If not, the operations won't be part of the transaction!**

---

## Step 8: Check Error Handling

**Question 9:** Look at your `app.js`:

- [ ] Is `errorMiddleware` imported?
- [ ] Is it registered with `app.use(errorMiddleware)`?
- [ ] Is it registered AFTER all your routes? (Must be last!)

If error middleware is missing or in wrong position, errors won't be handled properly.

---

## Summary: What Did You Find?

After going through these steps, list what issues you discovered:

1. ***
2. ***
3. ***

---

## Try This: Break It On Purpose

To really understand debugging, try breaking things:

1. **Remove `express.json()`** temporarily

   - Make a request
   - See what happens
   - Add it back
   - See the difference

2. **Change the route path** in Postman

   - Make it wrong on purpose
   - See the 404 error
   - Understand route matching

3. **Remove Content-Type header** in Postman
   - See how body parsing fails
   - Understand why headers matter

**Learning by breaking things helps you understand how they work!**

---

## Next Steps

Once you've identified the issues:

1. Fix them one at a time
2. Test after each fix
3. Add console.logs to verify each step works
4. Remove debug logs when done

**Remember:** Debugging is a skill. The more you practice, the faster you'll find issues!

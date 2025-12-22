import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';


// what is req body?
// req body is the body of the request
// req body is the data that is sent to the server in the body of the request

/*
 * ERROR HANDLING: next(error) vs throw error
 * 
 * 1. next(error):
 *    - Explicitly passes error to Express error middleware (4-parameter middleware)
 *    - MUST set error.statusCode BEFORE calling next(error)
 *    - Example:
 *        const error = new Error('User not found');
 *        error.statusCode = 404;
 *        return next(error);
 * 
 * 2. throw error:
 *    - Throws an exception that needs to be caught
 *    - In Express 5+ or with express-async-errors, Express can catch thrown errors
 *    - Still need to set error.statusCode before throwing
 *    - Example:
 *        const error = new Error('User not found');
 *        error.statusCode = 404;
 *        throw error;
 * 
 * IMPORTANT: When using next(error), you MUST set error.statusCode, otherwise
 * the error middleware will default to status 500 (Server Error).
 */



export const signUp = async (req, res, next) => {
    /*
        Q: Why do startSession() and abortTransaction() require await, but not startTransaction() and endSession()?

        - startSession() and abortTransaction() are asynchronous functions that return Promises. 
        - Thus, you must "await" them to ensure that the session is created, or the transaction is aborted before proceeding.
        - startTransaction() is a synchronous method on the session object. It starts a transaction context in memory (no round trip to the database), so it does not return a Promise and does not require await.
        - endSession() is also synchronous — it simply marks the session for cleanup and does not wait for any database response, so it does not return a Promise and does not require await.
    */
    const session = await mongoose.startSession();
    session.startTransaction();
    try
    {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        // Hash password with bcrypt
        // First parameter: password to hash
        // Second parameter: salt rounds (10 is a good default - higher is more secure but slower)
        const hashedPassword = await bcrypt.hash(password, 10);


        if (existingUser)
        {
            const error = new Error('User already exists');
            error.statusCode = 409; // Conflict status code
            return next(error);
        }

        const users = await User.create([{ name, email, password: hashedPassword }], { session });
        await session.commitTransaction();
        session.endSession();

        const token = jwt.sign({ userId: users[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).json({ success: true, message: 'User created successfully', data: { user: users[0], token } });
    } catch (error)
    {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {

    try
    {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
        {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
        {
            const error = new Error('Invalid password');
            error.statusCode = 401; // Unauthorized status code
            return next(error);
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({ success: true, message: 'User signed in successfully', data: { user, token } });
    } catch (error)
    {
        next(error);
    }
}

export const signOut = async (req, res, next) => {

} 
import mongoose from 'mongoose';
import User from '../models/user.model.js';


// what is req body?
// req body is the body of the request
// req body is the data that is sent to the server in the body of the request



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
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if(existingUser){
            return next(new Error('User already exists'));
        }

        const user = await User.create({ name, email, password });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ user });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {

}

export const signOut = async (req, res, next) => {

} 
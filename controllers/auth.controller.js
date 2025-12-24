import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const signUp = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try
    {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
        {
            const error = new Error('User already exists');
            error.statusCode = 422;
            return next(error);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const users = await User.create([{ email, password: hashPassword }], { session });
        const token = jwt.sign({ userId: users[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ success: true, message: 'user created', data: { user: users[0], token } })

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
            next(error);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect)
        {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            next(error);
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
        res.status(200).json({ success: true, message: 'Login successful', data: { user, token } })
    } catch (error)
    {
        next(error);
    }
}

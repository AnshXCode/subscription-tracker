import express from 'express';
import { PORT } from './config/env.js';
import { connectDB } from './database/mongodb.js';
import authRouter from './routes/auth.routes.js';
import errorMiddleware from './middlewares/error.middlewares.js';
const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    await connectDB();
});

export default app;
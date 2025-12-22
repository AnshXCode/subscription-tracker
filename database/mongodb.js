import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);

    // Using process.exit(1) here is important because it immediately stops the Node.js process with a failure code (1).
    // This signals to any parent process or deployment tool that the application did not start successfully.
    // Without process.exit(1), the application would continue running in a broken state, possibly accepting requests
    // even though the database connection failed, leading to unexpected errors or data issues.
    process.exit(1);
  }
};

/**
 * process is a global object in Node.js that provides information and control over the currently running Node.js process.
 * It gives you access to environment variables, current working directory, process ID, event hooks, and more.
 * 
 * Commonly used process methods include:
 * 
 * - process.exit([code]): Exits the process with the specified exit code (default: 0). Non-zero (like 1) usually signals an error.
 * - process.env: An object containing the user environment (e.g., DB URLs, secrets, NODE_ENV).
 * - process.cwd(): Returns the current working directory of the Node.js process.
 * - process.on(event, callback): Adds a handler for process-level events like 'exit', 'uncaughtException', 'SIGINT' (Ctrl+C), etc.
 * - process.pid: The PID (process ID) of the current Node.js process.
 * - process.argv: Array containing the command-line arguments passed to the Node.js process.
 * - process.uptime(): Returns the number of seconds the current Node.js process has been running.
 * 
 * Example:
 * 
 *   process.on('SIGINT', () => {
 *     console.log('Received SIGINT. Shutting down gracefully.');
 *     process.exit(0);
 *   });
 * 
 * See Node.js docs for more: https://nodejs.org/api/process.html
 */

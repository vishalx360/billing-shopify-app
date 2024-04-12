/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
const { MONGODB_URI } = process.env;

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    global?.logger?.info(
      `Database connected: ${conn.connection.host} ${conn.connection.port}`,
    );
  } catch (e) {
    console.log(`Database connection error: ${e}`);
    global?.logger?.error(`Database connection error: ${e}`);
    process.exit(1);
  }
};


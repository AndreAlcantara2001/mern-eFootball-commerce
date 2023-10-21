import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const app = express();
const PORT = process.env.PORT || 3000;
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

import cookieParser from 'cookie-parser';

app.use(express.json())

app.use(cookieParser())

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})

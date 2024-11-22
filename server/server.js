import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './db/index.js'

dotenv.config({
  path: './env'
});

import userRouter from './routes/user.routes.js';
import insightsRouter from './routes/insights.route.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://social-media-analytics-frontend.vercel.app'],
    credentials: true,
}));

connectDB()
.then(() => {

  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/insights", insightsRouter);
  
  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

})
.catch(() => {
  console.log("MONGO DB connection failed", error);
});

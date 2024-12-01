import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./db/db.js";
import userRouter from './routes/user.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieParser({
    credentials: true, // Fixed typo
  })
);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["POST", "PUT", "GET", "DELETE"],
  credentials: true, // Allow cookies from this origin
};
app.use(cors(corsOptions));

// created api's
app.use('/api/v1/user',userRouter)
// Database connection
connectDb();

// Start server
app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});

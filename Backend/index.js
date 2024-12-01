import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
const corsOprtion = {
  origin: "http://localhost:5173",
  method: ["POST", "PUT", "GET", "DELETE"],
};
app.use(cors(corsOprtion));
app.use(express.urlencoded({ extended: true }));

connectDb();
app.listen(PORT, () => {
  console.log(`The server is listen on ${PORT} port`);
});

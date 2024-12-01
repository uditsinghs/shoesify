import mongoose from "mongoose";

export const connectDb = async()=>{
  const URL = process.env.MONGODB_URI
  try {
    await mongoose.connect(URL)
    console.log("connected to Db");
    
  } catch (error) {
    console.log(error);
    process.exit(1)
    
  }
}
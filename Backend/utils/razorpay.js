import Razorpay from 'razorpay'
import dotenv from "dotenv";
dotenv.config();
// razorpay integration config
export const razorpayInstance = new Razorpay({
  key_id: process.env.ROZARPAY_API_KEY,
  key_secret: process.env.ROZARPAY_API_SECRET
})
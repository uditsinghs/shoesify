import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

export const uploadMedia = async (file) => {
  try {
    if (!file) return null;
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    fs.unlinkSync(file);
    return uploadResponse;
  } catch (error) {
    fs.unlinkSync(file); 
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

export const deleteMediaFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log(error);
  }
};

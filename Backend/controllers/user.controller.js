import { User } from "../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, answer } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exist Please login.",
        success: false,
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      answer,
    });

    res.status(201).json({
      message: `Welcome back ${username}`,
      success: true,
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
};

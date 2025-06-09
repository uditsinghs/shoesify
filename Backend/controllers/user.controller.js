import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { Cart } from "../models/cart.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto'
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
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


    const verifyToken = crypto.randomBytes(32).toString("hex");


    const newUser = await User.create({
      username,
      email,
      password,
      verifyToken
    });

    const verifyURL = `https://shoesify-1.onrender.com/verify/${verifyToken}`;

    await sendEmail(email, "Verify your email", `
        <h2>Hello ${username}</h2>
      <p>Click the link to verify your email:</p>
      <a href="${verifyURL}">${verifyURL}</a>`)

    res.status(201).json({
      message: "Registration successful, please verify your email",
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

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verifyToken: token });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    res.json({ message: "Email verified successfully" });


  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error,
    });
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isMatch = await user.comparPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }


    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify email,we sent a email just click on it to verify",
      });
    }

    generateToken(res, user, `Welcome back, ${user.username}!`, 200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
       httpOnly: true,             
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict",        
      maxAge:0,
      })
      .status(200)
      .json({
        message: "Logout successfully.",
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please not found", success: false })
    }

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ message: "User not found or not verified" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetURL = `https://shoesify-1.onrender.com/reset-password/${resetToken}`;
    await sendEmail(email, "Reset your password", `
      <p>Click the link to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
    `);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {

  const { token } = req.params;
  console.log("token", token);

  const { password } = req.body;
  try {


    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    console.log("user", user);

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });


    const hashedPassword = bcrypt.hash(password, 10)

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}


export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.country
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a complete address.",
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.address = {
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    };

    await user.save();

    res.status(200).json({
      message: "Address added successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Please provide an address to update.",
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update only provided fields
    if (address.street) user.address.street = address.street;
    if (address.city) user.address.city = address.city;
    if (address.state) user.address.state = address.state;
    if (address.zip) user.address.zip = address.zip;
    if (address.country) user.address.country = address.country;

    await user.save();

    res.status(200).json({
      message: "Address updated successfully.",
      success: true,
      address: user.address,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    user.address = undefined;
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

// admin controller

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json({
        message: "No users available",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the user has an associated cart and delete it
    const cart = await Cart.findOne({ userId });
    if (cart) {
      await cart.deleteOne();
    }

    res.status(200).json({
      success: true,
      message: "User and associated cart deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const updatedUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.state(404).json({
        message: "User not found",
        success: false,
      });
    }
    const { role } = req.body;

    if (user) {
      user.role = role;
      await user.save();
    }
    res.status(200).json({
      message: "user role changed.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

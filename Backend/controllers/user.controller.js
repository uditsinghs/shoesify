import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { Cart } from "../models/cart.model.js";

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
      message: "Registered successfully",
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
        sameSite: "Strict",
        maxAge: 0,
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

export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, answer } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        success: false,
      });
    }
    if (!answer) {
      return res.status(404).json({
        message: "please provide answer of question.",
        success: false,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "confirm password is not match.",
        success: false,
      });
    }
    // check if the answer that store in db is matched by input answer.
    if (user.answer !== answer) {
      return res.status(400).json({
        message: "input right answer.",
        success: false,
      });
    }
    // now change the password;
    if (user.password) {
      user.password = password;
      await user.save();
    }
    res.status(200).json({
      message: "Password reset successfully.",
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

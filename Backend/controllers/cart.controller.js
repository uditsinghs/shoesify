import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { calculateTotalPrice } from "../utils/totalCartPrice.js";

export const addToCart = async (req, res) => {
  try {
    const { pid } = req.body;
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }

    // Find or create a cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
      });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      // If product exists, update its quantity
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Add new product to the cart
      cart.products.push({ product: pid });
      cart.products.quantity += 1;
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Product added to cart successfully.",
      success: true,
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const getAllCartProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const products = await Cart.find({ userId }).populate("products.product");
    if (products.length === 0) {
      return res.status(200).json({
        message: "Go to shooping page to add Product",
      });
    }
    const totalPrice = calculateTotalPrice(products);
    return res.status(200).json({
      success: true,
      products,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { pid } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
        success: false,
      });
    }

    // Filter the products array to remove the product with the given product ID
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );
    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
        success: false,
      });
    }

    cart.products = [];
    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { pid, quantity } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
        success: false,
      });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in cart.",
        success: false,
      });
    }

    // If quantity is less than or equal to 0, remove the product from the cart
    if (quantity <= 0) {
      cart.products.splice(productIndex, 1);
    } else {
      // Update the quantity if it's valid
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();

    return res.status(200).json({
      message: "Cart updated successfully.",
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({
        message: "Cart is empty.",
        success: true,
        cart: [],
      });
    }

    const totalPrice = calculateTotalPrice(cart.products);

    return res.status(200).json({
      success: true,
      cart,
      totalPrice,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};



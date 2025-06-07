import { razorpayInstance } from '../utils/razorpay.js'
import crypto from 'crypto';
import { Order } from '../models/order.model.js'
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcptid_${Date.now()}`,
    }
    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json({ order })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      error,
      success: false
    })

  }
}


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, userId, amount } = req.body;
    const hmac = crypto
      .createHmac("sha256", process.env.ROZARPAY_API_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (hmac === razorpay_signature) {
      const newOrder = await Order.create({
        user: userId,
        products: cartItems,
        amount: amount,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        status: "paid",
      });
      return res.status(200).json({ success: true, message: "Payment verified and order placed!", newOrder });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      error,
      success: false
    });
  }
};


export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("user", "username email").populate("products.product", "name price image");
    if (orders.length === 0) {
      return res.status(200).json({ message: "You have not order anything please go to product to order", success: true })
    }
    return res.status(200).json({ orders })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      error,
      success: false
    })

  }
}

// GET /api/v1/order/:orderId
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;


    const order = await Order.findById(orderId)
      .populate("user", "username email")
      .populate("products.product", "name price image");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get order",
      error,
    });
  }
};

// GET /api/v1/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 }).populate("products.product", "name image price")

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching orders", error });
  }
};

// PUT /api/v1/order/status/:orderId
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update status", error });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
import express from 'express';
import { createOrder, deleteOrder, getAllOrders, getOrderById, getUserOrders, updateOrderStatus, verifyPayment } from '../controllers/order.controller.js';
import { isAuthenticated, isAuthorized } from '../middleware/authentication.js'
const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder)
router.post('/payment/verify', isAuthenticated, verifyPayment);
router.get('/order/:orderId', isAuthenticated, getOrderById);
router.get('/userorders', isAuthenticated, getUserOrders)
router.get('/admin/orders', isAuthenticated, isAuthorized("admin"), getAllOrders)
router.put('/admin/status/:orderId', isAuthenticated, isAuthorized("admin"),updateOrderStatus)
router.delete("/delete/:orderId", isAuthenticated, deleteOrder);
export default router;
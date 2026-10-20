const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Public route to create order
router.post('/', orderController.createOrder);

// Mock payment route
router.post('/:id/pay', orderController.processPayment);

// Protected routes (Admin only)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id', verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;

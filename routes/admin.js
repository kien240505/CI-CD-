const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tài khoản và mật khẩu!' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign(
      { id: 0, email: ADMIN_USER, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.json({
      success: true,
      token,
      admin: {
        username: ADMIN_USER,
        role: 'admin',
        name: 'Quản Lý Trưởng'
      },
      message: 'Đăng nhập quản trị thành công!'
    });
  } else {
    return res.status(401).json({ error: 'Tài khoản hoặc mật khẩu không chính xác!' });
  }
});

router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const prodResult = await pool.request().query('SELECT COUNT(*) as totalProducts, SUM(CASE WHEN stock <= 3 THEN 1 ELSE 0 END) as lowStock FROM products');
    const orderResult = await pool.request().query('SELECT COUNT(*) as totalOrders, SUM(total_amount) as totalRevenue FROM orders');
    const commentResult = await pool.request().query('SELECT COUNT(*) as totalComments FROM comments');

    res.json({
      totalProducts: prodResult.recordset[0].totalProducts || 0,
      lowStock: prodResult.recordset[0].lowStock || 0,
      totalOrders: orderResult.recordset[0].totalOrders || 0,
      totalRevenue: orderResult.recordset[0].totalRevenue || 0,
      totalComments: commentResult.recordset[0].totalComments || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

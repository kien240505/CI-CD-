const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject and message are required' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.NVARCHAR, name)
      .input('email', sql.NVARCHAR, email)
      .input('phone', sql.NVARCHAR, phone || '')
      .input('subject', sql.NVARCHAR, subject)
      .input('message', sql.NVARCHAR, message)
      .query(`
        INSERT INTO contact_messages (name, email, phone, subject, message) 
        OUTPUT INSERTED.id
        VALUES (@name, @email, @phone, @subject, @message)
      `);
      
    res.status(201).json({
      id: result.recordset[0].id,
      message: 'Gửi tin nhắn liên hệ thành công! TechNova sẽ phản hồi sớm nhất.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM contact_messages ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const { poolPromise, sql } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

exports.register = async (req, res) => {
  const { fullname, email, phone, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự!' });
  }

  try {
    const pool = await poolPromise;
    const checkResult = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT id FROM users WHERE email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ error: 'Email này đã được đăng ký. Vui lòng dùng email khác!' });
    }

    const avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === (process.env.ADMIN_USER || 'admin') ? 'admin' : 'user';

    const insertResult = await pool.request()
      .input('fullname', sql.NVARCHAR, fullname)
      .input('email', sql.NVARCHAR, email)
      .input('phone', sql.NVARCHAR, phone || '')
      .input('password', sql.NVARCHAR, hashedPassword)
      .input('avatar', sql.NVARCHAR, avatar)
      .input('role', sql.NVARCHAR, role)
      .query(`
        INSERT INTO users (fullname, email, phone, password, avatar, role) 
        OUTPUT INSERTED.id
        VALUES (@fullname, @email, @phone, @password, @avatar, @role)
      `);

    const newId = insertResult.recordset[0].id;

    res.status(201).json({
      success: true,
      user: { id: newId, fullname, email, avatar, role },
      message: `Đăng ký thành công! Chào mừng ${fullname} đến với TechNova!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập Email và Mật khẩu!' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Email chưa được đăng ký trong hệ thống!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác!' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      },
      message: `Đăng nhập thành công! Chào mừng trở lại ${user.fullname}!`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Vui lòng nhập Email!' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVARCHAR, email)
      .query('SELECT id FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng với email này!' });

    const resetToken = Math.random().toString(36).substring(2, 15);
    await pool.request()
      .input('resetToken', sql.NVARCHAR, resetToken)
      .input('id', sql.INT, user.id)
      .query('UPDATE users SET reset_token = @resetToken WHERE id = @id');

    res.json({ 
      message: 'Mã khôi phục đã được gửi (Mock)', 
      resetToken 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, fullname, email, phone, avatar, role, created_at FROM users ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

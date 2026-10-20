const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'technova_secret_key_123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'Không tìm thấy token xác thực!' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token không hợp lệ!' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ!' });
    req.user = decoded; // { id, email, role, ... }
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Yêu cầu quyền quản trị viên!' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  JWT_SECRET
};

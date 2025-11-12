const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return res.status(401).json({ message: 'ต้องเข้าสู่ระบบก่อน' });
    }

    const payload = jwt.verify(token, process.env.AUTH_JWT_SECRET || 'dev-secret');
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'session หมดอายุ กรุณาเข้าสู่ระบบใหม่'
      : 'Token ไม่ถูกต้อง';
    res.status(401).json({ message });
  }
}

module.exports = requireAuth;

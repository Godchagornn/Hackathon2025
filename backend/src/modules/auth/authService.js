const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('./authModel');

const SALT_ROUNDS = Number(process.env.AUTH_SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.AUTH_JWT_EXPIRES_IN || '7d';

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function ensureCmuEmail(email) {
  if (!email || !email.toLowerCase().endsWith('@cmu.ac.th')) {
    throw createHttpError('ต้องใช้อีเมล @cmu.ac.th');
  }
}

function ensurePassword(password) {
  if (!password || password.length < 6) {
    throw createHttpError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
  }
}

function buildToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

function mapUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name || user.email,
    faculty: user.faculty || 'ไม่ระบุ',
    avatarUrl: user.avatar_url,
    bio: user.bio,
  };
}

async function registerUser({ firstName, lastName, email, password, faculty }) {
  ensureCmuEmail(email);
  ensurePassword(password);

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const displayName = `${firstName} ${lastName}`.trim();
  const user = await authModel.upsertUser({
    email: email.toLowerCase(),
    displayName,
    faculty,
    bio: null,
    avatarUrl: null,
    passwordHash,
  });

  return {
    token: buildToken(user),
    user: mapUserResponse(user),
  };
}

async function loginUser({ email, password }) {
  ensureCmuEmail(email);
  ensurePassword(password);

  const user = await authModel.findUserByEmail(email.toLowerCase());
  if (!user || !user.password_hash) {
    throw createHttpError('ไม่พบผู้ใช้หรือยังไม่ได้สมัครสมาชิก', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw createHttpError('รหัสผ่านไม่ถูกต้อง', 401);
  }

  return {
    token: buildToken(user),
    user: mapUserResponse(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
};

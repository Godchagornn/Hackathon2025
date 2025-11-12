const authService = require('./authService');

async function register(req, res, next) {
  try {
    const payload = await authService.registerUser(req.body || {});
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const payload = await authService.loginUser(req.body || {});
    res.json(payload);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
};

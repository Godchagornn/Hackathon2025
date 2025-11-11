const express = require('express');
const profileRoutes = require('../modules/profile/profileRoutes');

const router = express.Router();

router.use('/profiles', profileRoutes);

module.exports = router;

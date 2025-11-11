const express = require('express');
const profileController = require('./profileController');

const router = express.Router();

router.get('/:id', profileController.getProfile);

module.exports = router;

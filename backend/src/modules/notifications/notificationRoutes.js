const express = require('express');
const notificationController = require('./notificationController');

const router = express.Router({ mergeParams: true });

router.post('/', notificationController.createExchangeRequestNotification);
router.get('/', notificationController.listNotifications);
router.post('/:notificationId/accept', notificationController.acceptNotification);
router.post('/:notificationId/reject', notificationController.rejectNotification);
router.post('/:notificationId/complete', notificationController.completeNotification);

module.exports = router;

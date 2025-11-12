const notificationService = require('./notificationService');

function parseIds(req, res) {
  const userId = Number(req.params.profileId);
  if (Number.isNaN(userId)) {
    res.status(400).json({ message: 'Invalid profile id' });
    return null;
  }

  const notificationId = req.params.notificationId
    ? Number(req.params.notificationId)
    : null;

  if (req.params.notificationId && Number.isNaN(notificationId)) {
    res.status(400).json({ message: 'Invalid notification id' });
    return null;
  }

  return { userId, notificationId };
}

async function listNotifications(req, res, next) {
  try {
    const ids = parseIds(req, res);
    if (!ids) return;

    const notifications = await notificationService.listNotificationsForUser(ids.userId);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
}

async function acceptNotification(req, res, next) {
  try {
    const ids = parseIds(req, res);
    if (!ids) return;
    if (!ids.notificationId) {
      return res.status(400).json({ message: 'Notification id is required' });
    }

    const notification = await notificationService.acceptRequest({
      userId: ids.userId,
      requestId: ids.notificationId,
    });

    res.json({ notification });
  } catch (error) {
    next(error);
  }
}

async function rejectNotification(req, res, next) {
  try {
    const ids = parseIds(req, res);
    if (!ids) return;
    if (!ids.notificationId) {
      return res.status(400).json({ message: 'Notification id is required' });
    }

    const notification = await notificationService.rejectRequest({
      userId: ids.userId,
      requestId: ids.notificationId,
    });

    res.json({ notification });
  } catch (error) {
    next(error);
  }
}

async function completeNotification(req, res, next) {
  try {
    const ids = parseIds(req, res);
    if (!ids) return;
    if (!ids.notificationId) {
      return res.status(400).json({ message: 'Notification id is required' });
    }

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Exchange code is required' });
    }

    const notification = await notificationService.completeExchange({
      userId: ids.userId,
      requestId: ids.notificationId,
      code,
    });

    res.json({ notification });
  } catch (error) {
    next(error);
  }
}

async function createExchangeRequestNotification(req, res, next) {
  try {
    const ids = parseIds(req, res);
    if (!ids) return;

    const { requesterId, itemId, message, offer } = req.body || {};

    if (!requesterId || !itemId) {
      return res.status(400).json({ message: 'requesterId and itemId are required' });
    }

    const notification = await notificationService.createExchangeRequestNotification({
      ownerId: ids.userId,
      requesterId: Number(requesterId),
      itemId: Number(itemId),
      message: message || '',
      offer,
    });

    res.status(201).json({ notification });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listNotifications,
  acceptNotification,
  rejectNotification,
  completeNotification,
  createExchangeRequestNotification,
};

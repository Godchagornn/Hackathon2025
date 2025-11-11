const profileService = require('./profileService');

async function getProfile(req, res, next) {
  try {
    const userId = Number(req.params.id);

    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid profile id' });
    }

    const result = await profileService.getProfileOverview(userId);

    if (!result) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
};

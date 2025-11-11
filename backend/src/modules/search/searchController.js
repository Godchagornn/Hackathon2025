const searchService = require('../searchService');

exports.searchItems = async (req, res, next) => {
  try {
    const result = await searchService.searchItems(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const suggestions = await searchService.getSuggestions(req.query.q || '');
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};

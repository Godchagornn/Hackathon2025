const searchService = require('../searchService');

exports.searchItems = async (req, res, next) => {
  try {
    const result = await searchService.searchItems(req.query);
    res.json(result); // { items, total, filters }
  } catch (err) {
    next(err);
  }
};

exports.getSuggestions = async (req, res, next) => {
  try {
    const suggestions = await searchService.getSuggestions(req.query.q || '');
    res.json({ suggestions }); // { suggestions: [] }
  } catch (err) {
    next(err);
  }
};

exports.getFaculties = async (req, res, next) => {
  try {
    const faculties = await searchService.getFaculties();
    res.json({ faculties }); // { faculties: [] }
  } catch (err) {
    next(err);
  }
};

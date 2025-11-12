import * as searchService from './searchService.js';

export const searchItems = async (req, res, next) => {
  try {
    const result = await searchService.searchItems(req.query);
    res.json(result); // { items, total, filters }
  } catch (err) {
    next(err);
  }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const suggestions = await searchService.getSuggestions(req.query.q || '');
    res.json({ suggestions }); // { suggestions: [] }
  } catch (err) {
    next(err);
  }
};

export const getFaculties = async (req, res, next) => {
  try {
    const faculties = await searchService.getFaculties();
    res.json({ faculties }); // { faculties: [] }
  } catch (err) {
    next(err);
  }
};

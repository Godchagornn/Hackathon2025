const profileModel = require('./profileModel');

function mapUserToProfile(userRow) {
  return {
    id: userRow.id,
    name: userRow.display_name || userRow.email,
    faculty: userRow.faculty,
    email: userRow.email,
    bio: userRow.bio,
    avatar: userRow.avatar_url,
    stats: undefined, // filled below when items/exchanges are known
  };
}

function mapItem(itemRow) {
  return {
    id: itemRow.id,
    title: itemRow.title,
    description: itemRow.description,
    category: itemRow.category,
    condition: itemRow.condition,
    status: itemRow.status,
    images: itemRow.images,
    tags: itemRow.tags,
    createdAt: itemRow.created_at,
  };
}

function mapExchange(exchangeRow, userId) {
  return {
    id: exchangeRow.id,
    status: exchangeRow.status,
    createdAt: exchangeRow.created_at,
    updatedAt: exchangeRow.updated_at,
    role: exchangeRow.owner_id === userId ? 'owner' : 'requester',
    itemTitle: exchangeRow.item_title,
    offeredItemTitle: exchangeRow.offered_item_title,
  };
}

async function getProfileOverview(userId) {
  const user = await profileModel.findUserById(userId);
  if (!user) return null;

  const [items, exchanges] = await Promise.all([
    profileModel.findItemsByUserId(userId),
    profileModel.findExchangeHistoryByUserId(userId),
  ]);

  const mappedItems = items.map(mapItem);
  const mappedExchanges = exchanges.map((exchange) =>
    mapExchange(exchange, userId),
  );

  const stats = {
    itemsShared: mappedItems.length,
    exchangeRequests: mappedExchanges.length,
    completedExchanges: mappedExchanges.filter(
      (exchange) => exchange.status === 'accepted' || exchange.status === 'completed',
    ).length,
  };

  const profile = mapUserToProfile(user);
  profile.stats = stats;

  return {
    profile,
    items: mappedItems,
    exchanges: mappedExchanges,
  };
}

module.exports = {
  getProfileOverview,
};

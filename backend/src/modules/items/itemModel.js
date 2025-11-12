const { DataTypes } = require('sequelize');
const sequelize = require('../../database/config.js');

const Item = sequelize.define('Item', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING, allowNull: false },
  condition: { type: DataTypes.ENUM('new', 'used'), allowNull: false },
  images: { type: DataTypes.ARRAY(DataTypes.STRING) },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
  faculty: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  tableName: 'items',
  indexes: [
    { fields: ['title'] },
    { fields: ['category'] },
    { fields: ['faculty'] },
    { fields: ['ownerId'] },
    { fields: ['isActive'] },
  ],
});

module.exports = Item;

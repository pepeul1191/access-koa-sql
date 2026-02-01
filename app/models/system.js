// app/models/system.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';

const System = sequelize.define(
  'System',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    repository: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'systems',
    timestamps: false, // 👈 igual que en User
  }
);

export default System;

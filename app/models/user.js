// app/models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    activation_key: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    reset_key: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // SQLite usa 0/1, Sequelize lo maneja
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
    tableName: 'users',
    timestamps: false, // 👈 porque NO usas createdAt / updatedAt
  }
);

export default User;

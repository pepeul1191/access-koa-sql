// app/models/vw_system_users.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';

const VwSystemUsers = sequelize.define(
  'VwSystemUsers',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // 👈 importante para Sequelize
    },

    system_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'vw_system_users',
    timestamps: false,
    freezeTableName: true,
  }
);

export default VwSystemUsers;

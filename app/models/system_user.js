// app/models/system_user.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';
import System from './system.js';
import User from './user.js';

const SystemUser = sequelize.define(
  'SystemUser',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    system_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: System,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'systems_users',
    timestamps: false, // igual que tus otros modelos
  }
);

// 🔹 Relaciones
System.belongsToMany(User, {
  through: SystemUser,
  foreignKey: 'system_id',
  otherKey: 'user_id',
});
User.belongsToMany(System, {
  through: SystemUser,
  foreignKey: 'user_id',
  otherKey: 'system_id',
});

export default SystemUser;

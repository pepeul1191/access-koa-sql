// app/models/user_permission.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';
import User from './user.js';
import Permission from './permission.js';

const UserPermission = sequelize.define(
  'UserPermission',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'users_permissions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'permission_id'], // evita duplicados
      },
    ],
  }
);

export default UserPermission;

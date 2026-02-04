// app/models/vw_user_roles_permissions.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';

const VwUserRolesPermissions = sequelize.define(
  'VwUserRolesPermissions',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // como clave principal para Sequelize
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    system_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'vw_user_roles_permissions', // nombre exacto de la vista
    timestamps: false, // las vistas normalmente no tienen createdAt/updatedAt
    underscored: true,
  }
);

export default VwUserRolesPermissions;

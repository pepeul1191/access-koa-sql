// app/models/role.js
import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';
import System from './system.js'; // Importamos el modelo relacionado

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
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

    system_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: System, // Referencia al modelo System
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    tableName: 'roles',
    timestamps: false, // igual que en System
  }
);

// Relación: un sistema tiene muchos roles
System.hasMany(Role, { foreignKey: 'system_id' });
Role.belongsTo(System, { foreignKey: 'system_id' });

export default Role;

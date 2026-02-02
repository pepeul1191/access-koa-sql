import { DataTypes } from 'sequelize';
import sequelize from '../../configs/database.js';
import Role from './role.js';

const Permission = sequelize.define(
  'Permission',
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

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    tableName: 'permissions',
    timestamps: false,
  }
);

// Relaciones
Role.hasMany(Permission, { foreignKey: 'role_id' });
Permission.belongsTo(Role, { foreignKey: 'role_id' });

export default Permission;

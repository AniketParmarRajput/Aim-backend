import { DataTypes } from 'sequelize';
import { sequelize } from '../../Config/db.js';


const User = sequelize.define('employee', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},{
    timestamps: true,
});
export default User;
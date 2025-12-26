import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";

const User = sequelize.define(
  "User",  // table name exactly 'user'
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    position:{
      type:DataTypes.STRING(45),
      allowNull:false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    freezeTableName: true, // table name will be exactly 'user'
    timestamps: true       // use Sequelize's automatic createdAt/updatedAt
  }
);

export default User;

import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";

const Prizing = sequelize.define(
  "Prizing",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
     image: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    badge: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    colour: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: "prizing",
    timestamps: false,
  }
);

export default Prizing;




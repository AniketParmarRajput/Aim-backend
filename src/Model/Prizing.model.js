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
  },
  {
    freezeTableName: "prizing",
    timestamps: false,
  }
);

export default Prizing;




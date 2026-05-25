import { DataTypes } from "sequelize";

import sequelize from "../../Config/db.js";

const PaypalPayment = sequelize.define(

  "PaypalPayment",

  {

    id: {

      type: DataTypes.INTEGER,

      autoIncrement: true,

      primaryKey: true,
    },



    orderID: {

      type: DataTypes.STRING(255),

      allowNull: false,
    },



    paymentID: {

      type: DataTypes.STRING(255),

      allowNull: false,
    },



    payerEmail: {

      type: DataTypes.STRING(255),

      allowNull: false,
    },



    amount: {

      type: DataTypes.STRING(100),

      allowNull: false,
    },



    currency: {

      type: DataTypes.STRING(20),

      allowNull: false,
    },



    status: {

      type: DataTypes.STRING(50),

      allowNull: false,
    },



    payerName: {

      type: DataTypes.STRING(255),

      allowNull: true,
    },



    captureTime: {

      type: DataTypes.STRING(255),

      allowNull: true,
    },

  },

  {

    freezeTableName: true,

    tableName: "paypal_payment",

    timestamps: true,

  }

);

export default PaypalPayment;
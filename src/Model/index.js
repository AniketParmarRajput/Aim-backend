import sequelize from "../../Config/db.js";
import User from "./User.model.js";
import Prizing from "./Prizing.model.js";
import PaypalPayment from "./Paypal.mode.js";
import Order from "./Order.model.js";

const db = {};
db.sequelize = sequelize;
db.User = User;
db.Prizing = Prizing;
db.PaypalPayment = PaypalPayment;
db.Order = Order;

export default db;



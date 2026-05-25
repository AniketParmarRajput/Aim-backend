import sequelize from "../../Config/db.js";
import User from "./User.model.js";
import Prizing from "./Prizing.model.js";
import PaypalPayment from "./Paypal.mode.js";

const db = {};
db.sequelize = sequelize;
db.User = User;
db.Prizing = Prizing;
db.PaypalPayment = PaypalPayment;

export default db;



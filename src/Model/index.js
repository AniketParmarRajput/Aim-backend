import sequelize from "../../Config/db.js";
import User from "./User.model.js";
import Prizing from "./Prizing.model.js";

const db = {};
db.sequelize = sequelize;
db.User = User;
db.Prizing = Prizing;

export default db;



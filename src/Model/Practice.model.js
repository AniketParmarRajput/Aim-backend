import { DataTypes } from "sequelize";
import sequelize from "../../Config/db.js";

const Practice = sequelize.define(
  "Practice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questionType: {
      type: DataTypes.ENUM("practical", "theory"),
      allowNull: false,
      defaultValue: "practical",
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedByEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    completedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // cooldown choice: after submission next attempt after 1 day or 1 week
    cooldown: {
      type: DataTypes.ENUM("1day", "1week"),
      allowNull: false,
      defaultValue: "1day",
    },
    nextAvailableAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Question media
    questionImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questionPdf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questionVideo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Solution media
    solutionImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    solutionPdf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    solutionVideo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  // media for question & solution (pdf/image/video) - single table PraticalQuestion
  {
    tableName: "PraticalQuestion",
    timestamps: true,
    freezeTableName: true,
  }
);

export default Practice;

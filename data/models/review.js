const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

const Review = sequelize.define(
    "Review",
    {
        id_review: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_transaction: {
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.INTEGER,
        },
        comment: {
            type: DataTypes.STRING,
        },
    },
);

module.exports = Review;
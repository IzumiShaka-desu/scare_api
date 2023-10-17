const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

const Messages = sequelize.define(
    "Messages",
    {
        id_message: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_room: {
            type: DataTypes.INTEGER,
        },
        id_sender: {
            type: DataTypes.INTEGER,
        },
        message: {
            type: DataTypes.STRING,
        },
        sent_at: {
            type: DataTypes.DATE,
        },
    },
);

module.exports = Messages;
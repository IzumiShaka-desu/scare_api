const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');
const Messages = require("./mitra-profile");
const User = require("./user");

const { Op } = require("sequelize");

const MitraRekening = sequelize.define(
    "mitra_rekening",
    {
        id_rekening: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_mitra: {
            type: DataTypes.INTEGER,

        },
        bank_name: {
            type: DataTypes.STRING,
        },
        account_number: {
            type: DataTypes.STRING,
        },
        account_name: {
            type: DataTypes.STRING,
        },
    },
);




module.exports = MitraRekening;
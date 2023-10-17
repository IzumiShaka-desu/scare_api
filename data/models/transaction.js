const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

const Transaction = sequelize.define(
    "Transaction",
    {
        id_transaction: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_vehicle: {
            type: DataTypes.INTEGER,
        },
        id_renter: {
            type: DataTypes.INTEGER,
        },
        // id_owner: {
        //     type: DataTypes.INTEGER,
        // },
        start_date: {
            type: DataTypes.DATE,
        },
        end_date: {
            type: DataTypes.DATE,
        },
        total_price: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.STRING,
        },
        // payment_method: {
        //     type: DataTypes.STRING,
        // },
        // payment_status: {
        //     type: DataTypes.STRING,
        // },
        // payment_proof: {
        //     type: DataTypes.STRING,
        // },
    },
);

module.exports = Transaction;
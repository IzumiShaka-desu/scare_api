const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');
// id_transaction	id_mitra	id_user	estimated_finish_date	service_type	status	delivery_fee	total_price	payment_method	payment_status	payment_proof
const Transaction = sequelize.define(
    "Transaction",
    {
        id_transaction: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_mitra: {
            type: DataTypes.INTEGER,
        },
        id_user: {
            type: DataTypes.INTEGER,
        },
        estimated_finish_date: {
            type: DataTypes.DATE,
        },
        service_type: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        delivery_fee: {
            type: DataTypes.INTEGER,
        },
        total_price: {
            type: DataTypes.INTEGER,
        },
        payment_method: {
            type: DataTypes.STRING,
        },
        payment_status: {
            type: DataTypes.STRING,
        },
        payment_proof: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    },
);

module.exports = Transaction;
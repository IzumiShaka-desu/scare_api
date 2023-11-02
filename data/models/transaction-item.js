const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

// id_transaction_item	id_transaction	id_items	total_count
const TransactionItem = sequelize.define(
    "transaction_item",
    {
        id_transaction_item: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_transaction: {
            type: DataTypes.INTEGER,
        },
        id_items: {
            type: DataTypes.INTEGER,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        subtotal: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    },
);

module.exports = TransactionItem;
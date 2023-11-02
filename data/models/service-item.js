const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

// id_items	item_name	price	service_type(enum('Deepwash', 'Repaint', 'Sol', 'Unyellowing'))	createdAt	updatedAt
const ServiceItem = sequelize.define(
    "service_item",
    {
        id_items: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_mitra: {
            type: DataTypes.INTEGER,
        },
        service_name: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
        service_type: {
            type: DataTypes.STRING,
        },
    },
);

module.exports = ServiceItem;
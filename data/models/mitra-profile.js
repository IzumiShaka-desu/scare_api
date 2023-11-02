const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');

const MitraProfile = sequelize.define(
    "mitra_profile",
    {
        id_mitra: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_owner: {
            type: DataTypes.INTEGER,
        },
        mitra_name: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        service_list: {
            type: DataTypes.STRING,
        },
        profile_photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
);

module.exports = MitraProfile;
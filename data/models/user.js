const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');
var bcrypt = require("bcrypt-nodejs");
const User = sequelize.define(
    "User",
    {
        "id_user": {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        level: {
            type: DataTypes.INTEGER,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        "profile-photo": {
            type: DataTypes.STRING,
            nullable: true,
        },
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = bcrypt.genSaltSync(10, 'a');
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.password) {
                    const salt = bcrypt.genSaltSync(10, 'a');
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            }
        },
        instanceMethods: {
            validPassword: (password) => {
                return bcrypt.compareSync(password, this.password);
            }
        }
    });
User.prototype.validatePassword = async (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
// User.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.local.password);
// };
// User.addScope('distance', (latitude, longitude, distance, unit = "km") => {
//     const constant = unit == "km" ? 6371 : unit == "miles" ? 3959 : 6371000;
//     const haversine = `(
//         ${constant} * acos(
//             cos(radians(${latitude}))
//             * cos(radians(latitude))
//             * cos(radians(longitude) - radians(${longitude}))
//             + sin(radians(${latitude})) * sin(radians(latitude))
//         )
//     )`;
//     return {
//         attributes: [
//             [sequelize.literal(haversine), 'distance'],
//         ],
//         having: sequelize.literal(`distance <= ${distance}`)
//     }
// })
module.exports = User;
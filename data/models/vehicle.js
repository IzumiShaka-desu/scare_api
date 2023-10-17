const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require("./user");
const Transaction = require("./transaction");
const Review = require("./review");


const Vehicle = sequelize.define(
    "Vehicle",
    {
        id_vehicle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_owner: {
            type: DataTypes.INTEGER,
        },
        brand: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,

        },
        description: {
            type: DataTypes.STRING,
        },
        latitude: {
            type: DataTypes.DOUBLE,

        },
        longitude: {
            type: DataTypes.DOUBLE,
        },
        images: {
            type: DataTypes.JSON,

        },
        status: {
            type: DataTypes.STRING,
        }, type: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
    },
);

const getVehicle = async (filterType, userId, location) => {
    const radiusInMeter = 100_000;
    let query = ``;
    switch (filterType) {
        case "recommended":
            // get 7 random vehicles

            query += `SELECT *`;
            // if (location) {
            //     query += `, geodistms(${location},latitude,longitude) as distance `;
            // }
            query += ` FROM Vehicles WHERE status = 'available' AND id_owner != ${userId}`;

            if (location) {
                query += ` AND geodistms(${location},latitude,longitude) < ${radiusInMeter}`;
            }

            query += ` ORDER BY RAND() LIMIT 7`;
            break;
        case "popular":
            // get 7 most popular vehicles
            query += `SELECT *`;
            // if (location) {
            //     query += `, geodistms(${location},latitude,longitude) as distance `;
            // }

            query += ` FROM Vehicles WHERE status = 'available' AND id_owner != ${userId}`;

            if (location) {
                query += ` AND geodistms(${location},latitude,longitude) < ${radiusInMeter}`;
            }

            query += ` ORDER BY RAND() LIMIT 7`;

            break;
        case "allProducts":
            // get all vehicles
            query += `SELECT *`;
            // if (location) {
            //     query += `, geodistms(${location},latitude,longitude) as distance `;
            // }

            query += ` FROM Vehicles WHERE status = 'available' AND id_owner != ${userId}`;

            if (location) {
                query += ` AND geodistms(${location},latitude,longitude) < ${radiusInMeter}`;
                query += ` ORDER BY geodistms(${location},latitude,longitude) ASC`;
            } else {
                query += ` ORDER BY createdAt DESC`;
            }
            break;
        case "myProducts":
            // get user vehicles
            query += `SELECT * FROM Vehicles WHERE id_owner = ${userId}`;
            break;
        case "newest":
            // get newest vehicles
            query += `SELECT * FROM Vehicles WHERE status = 'available' AND id_owner != ${userId} ORDER BY createdAt DESC LIMIT 7`;
            break;
        default:
            // get all vehicles
            query += `SELECT *`;
            // if (location) {
            //     query += `,  as distance `;
            // }

            query += ` FROM Vehicles WHERE status = 'available' AND id_owner != ${userId}`;

            if (location) {
                query += ` AND geodistms(${location},latitude,longitude) < ${radiusInMeter}`;
                query += ` ORDER BY geodistms(${location},latitude,longitude) ASC`;
            }
            break;
    }

    const vehicles = await sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
    });

    return vehicles;

}

const getVehicleById = async (id) => {
    const vehicle = await Vehicle.findOne({
        where: {
            id_vehicle: id,
        },
    });
    if (!vehicle) {
        return null;
    }
    // "owner": {
    //     "owner_id": 1,
    //     "owner_name": "Izumi Shaka",
    //     "owner_email": "shk@m.com",
    //     "owner_photo": "https://raw.githubusercontent.com/IzumiShaka-desu/gif_host/main/tenkuji_takeru.png"
    // },
    const owner = await User.findOne({
        where: {
            id_user: vehicle.id_owner,
        },
    });
    const ownerProfile = {
        owner_id: owner.id_user,
        owner_name: owner.name,
        owner_email: owner.email,
        owner_photo: owner["profile-photo"],
    }

    // "reviews": [{
    //         "review_id": 2,
    //         "reviewer": {
    //             "reviewer_id": 2,
    //             "reviewer_name": "Izumi Shaka",
    //             "reviewer_photo": "https://raw.githubusercontent.com/IzumiShaka-desu/gif_host/main/tenkuji_takeru.png"
    //         },
    //         "comment": "review content 2",
    //         "review_rating": 4.5,
    //         "review_date": "2021-08-01"
    //     }
    // ]
    const transactions = await Transaction.findAll({
        where: {
            id_vehicle: id,
        },
    });
    const listOfId = transactions.map((transaction) => {
        return {
            idTrx: transaction.id_transaction,
            idRenter: transaction.id_renter
        }
    });

    let reviews = [];
    let rating = 0;

    // async loop
    for (const id of listOfId) {
        const review = await Review.findOne({
            where: {
                id_transaction: id.idTrx,
            },
        });
        const reviewer = await User.findOne({
            where: {
                id_user: id.idRenter,
            },
        });
        // get transaction
        // check if review exist
        console.log(reviewer);
        if (!review) {
            continue;
        }
        const reviewProfile = {
            review_id: review.id_review,
            reviewer: {
                reviewer_id: reviewer.id_user,
                reviewer_name: reviewer.name,
                reviewer_photo: reviewer["profile-photo"],
            },
            comment: review.comment,
            rating: review.rating,
            review_date: review.createdAt,
        };
        rating += review.rating;
        reviews.push(reviewProfile);
    }

    // calculate rating
    if (reviews.length !== 0) {
        console.log(rating);
        console.log(reviews.length);
        rating /= reviews.length;
        console.log(rating);
    }
    return {
        id_vehicle: vehicle.id_vehicle,
        name: vehicle.name,
        price: vehicle.price,
        status: vehicle.status,
        description: vehicle.description,
        images: vehicle.images,
        location: {
            latitude: vehicle.latitude,
            longitude: vehicle.longitude
        },
        rating: rating,
        brand: vehicle.brand,
        type: vehicle.type,
        owner: ownerProfile,
        reviews: reviews,
    };
}


module.exports = {
    Vehicle,
    getVehicle,
    getVehicleById
}
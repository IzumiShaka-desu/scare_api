const router = require("express").Router();
const { JwtService, authenticateJWT } = require("../service/jwt-service");
const Transaction = require("../data/models/transaction");
const Review = require("../data/models/review");
const User = require("../data/models/user");
const { Vehicle, getVehicleById } = require("../data/models/vehicle");


const jwtService = new JwtService();

router.get("/", authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const outgoingTransactions = await Transaction.sequelize.query(
            `SELECT * FROM transactions WHERE id_renter = ${userId}`,
            {
                type: Transaction.sequelize.QueryTypes.SELECT,
            }
        );
        // every outgoing transaction give vehicle brand,name,and first image and give owner name
        const ownerNames = await User.sequelize.query(
            `SELECT name,id_user FROM users WHERE id_user IN (SELECT id_owner FROM vehicles WHERE id_vehicle IN (SELECT id_vehicle FROM transactions WHERE id_renter = ${userId}))`,
            {
                type: User.sequelize.QueryTypes.SELECT,
            }
        );
        console.log(ownerNames);
        const vehicleAttributes = await Vehicle.sequelize.query(
            `SELECT brand,name,images,id_vehicle,id_owner FROM vehicles WHERE id_vehicle IN (SELECT id_vehicle FROM transactions WHERE id_renter = ${userId})`,
            {
                type: Vehicle.sequelize.QueryTypes.SELECT,
            }
        );
        console.log(vehicleAttributes);

        const outgoingTransactionsWithVehicle = outgoingTransactions.map(
            (transaction) => {
                const vehicle = vehicleAttributes.find(
                    (vehicle) => vehicle.id_vehicle === transaction.id_vehicle
                );
                const ownerName = ownerNames.find(
                    (owner) => owner.id_user === vehicle.id_owner
                );
                console.log(ownerName);
                return {
                    ...transaction,
                    brand: vehicle.brand,
                    name: vehicle.name,
                    image: vehicle.images[0],
                    username: ownerName.name,
                };
            }
        );

        // incoming transactions is transactions that have vehicle id that user own
        // by check the vehicle id, we can get the vehicle owner id
        // then we can compare the vehicle owner id with user id
        const incomingTransactions = await Transaction.sequelize.query(
            `SELECT * FROM transactions WHERE id_vehicle IN (SELECT id_vehicle FROM vehicles WHERE id_owner = ${userId})`,
            {
                type: Transaction.sequelize.QueryTypes.SELECT,
            }
        );
        // every incoming transaction give vehicle brand,name,and first image and give renter name
        const renterNames = await User.sequelize.query(
            `SELECT name,id_user FROM users WHERE id_user IN (SELECT id_renter FROM transactions WHERE id_vehicle IN (SELECT id_vehicle FROM vehicles WHERE id_owner = ${userId}))`,
            {
                type: User.sequelize.QueryTypes.SELECT,
            }
        );
        const vehicleAttributes2 = await Vehicle.sequelize.query(
            `SELECT brand,name,images,id_vehicle,id_owner FROM vehicles WHERE id_vehicle IN (SELECT id_vehicle FROM transactions WHERE id_vehicle IN (SELECT id_vehicle FROM vehicles WHERE id_owner = ${userId}))`,
            {
                type: Vehicle.sequelize.QueryTypes.SELECT,
            }
        );
        const incomingTransactionsWithVehicle = incomingTransactions.map(
            (transaction) => {
                const vehicle = vehicleAttributes2.find(
                    (vehicle) => vehicle.id_vehicle === transaction.id_vehicle
                );
                const renterName = renterNames.find(
                    (renter) => renter.id_user === transaction.id_renter
                );
                return {
                    ...transaction,
                    brand: vehicle.brand,
                    name: vehicle.name,
                    image: vehicle.images[0],
                    username: renterName.name,
                };
            }
        );
        // join outgoing and incoming transactions
        const transactions = [
            ...incomingTransactionsWithVehicle.map(
                (transaction) => {
                    transaction.type = "incoming";
                    return transaction;
                }
            ),
            ...outgoingTransactionsWithVehicle.map((transaction) => {
                transaction.type = "outgoing";
                return transaction;
            }),
        ];

        res.status(200).send(transactions);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/", authenticateJWT, async (req, res) => {
    const { idVehicle, startDate, endDate, totalPrice } = req.body;

    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const transaction = await Transaction.create({
            id_vehicle: idVehicle,
            id_renter: userId,
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
        });
        res.status(201).send(transaction);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});
router.get("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                id_transaction: id,
            },
        });
        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }
        // from transaction get author and renter profile

        const vehicle = await getVehicleById(transaction.id_vehicle);
        if (!vehicle) {
            return res.status(404).send("Vehicle not found");
        }
        console.log(userId);
        console.log(transaction.id_renter);
        if (userId !== vehicle.owner.owner_id && userId !== transaction.id_renter) {
            return res.status(401).send("Unauthorized");
        }
        // get renter profile
        const renter = await User.findOne({
            where: {
                id_user: transaction.id_renter,
            },
        });
        if (!renter) {
            return res.status(404).send("Renter not found");
        }
        console.log(renter);
        const renterProfile = {
            id: renter.id_user,
            name: renter.name,
            photo: renter["profile-photo"],
        };
        let transactionType = "incoming";
        if (userId === transaction.id_renter) {
            transactionType = "outgoing";
        }
        // get review for this transaction if exits
        const review = await Review.findOne({
            where: {
                id_transaction: transaction.id_transaction,
            },
        });
        const response = {
            id: transaction.id_transaction,
            vehicle: vehicle,
            renter: renterProfile,
            start_date: transaction.start_date,
            end_date: transaction.end_date,
            total_price: transaction.total_price,
            status: transaction.status,
            type: transactionType,
            review: review,
        };
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});
router.put("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                id_transaction: id,
                id_renter: userId,
            },
        });
        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }
        transaction.status = status;
        // get vehicle
        const vehicle = await Vehicle.findOne({
            where: {
                id_vehicle: transaction.id_vehicle,
            },
        });
        if (!vehicle) {
            return res.status(404).send("Vehicle not found");
        }
        vehicle.status = status !== "at_renter" ? "available" : "not available";

        // switch (status) {
        //     case "booked":
        //         vehicle.status = "available";
        //         break;
        //     case "at_renter":
        //         vehicle.status = "not available";
        //         break;
        //     case "canceled":
        //         vehicle.status = "available";
        //         break;
        //     case "returned":
        //         vehicle.status = "available";
        //         break;
        //     default:
        //         break;
        // }
        await transaction.save();
        await vehicle.save();
        res.status(200).send(transaction);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/:id/review", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                id_transaction: id,
                id_renter: userId,
            },
        });
        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }
        const review = await Review.create({
            id_transaction: id,
            rating: rating,
            comment: comment,
        });
        res.status(201).send(review);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});


module.exports = router;
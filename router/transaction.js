const router = require("express").Router();
const { JwtService, authenticateJWT } = require("../service/jwt-service");
const Transaction = require("../data/models/transaction");
const TransactionItem = require("../data/models/transaction-item");
const { upload } = require("../service/upload-service");
const Review = require("../data/models/review");
const ServiceItem = require("../data/models/service-item");

router.get("/", authenticateJWT, async (req, res) => {
    const id_user = req.user.id;
    if (!id_user) {
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.findAll({
            where: {
                id_user,
            },
        });
        return res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
}
);

router.get("/mitra/:id", authenticateJWT, async (req, res) => {
    const id_mitra = req.params.id;
    if (!id_mitra) {
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.findAll({
            where: {
                id_mitra,
            },
        });
        return res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
}
);


router.post("/", authenticateJWT, async (req, res) => {
    const { id_mitra, estimated_finish_date, service_type, delivery_fee, total_price, payment_method, items, notes } = req.body;
    const id_user = req.user.id;
    const status = "preparing";
    const payment_status = "unpaid";
    if (id_mitra == undefined || estimated_finish_date == undefined || service_type == undefined || delivery_fee == undefined || total_price == undefined || payment_method == undefined || id_user == undefined) {
        console.log(`${!id_mitra} ${!estimated_finish_date} ${!service_type} ${!delivery_fee} ${!total_price} ${!payment_method} ${!id_user}`);
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.create({
            id_mitra,
            id_user,
            estimated_finish_date,
            service_type,
            status,
            delivery_fee,
            total_price,
            payment_method,
            payment_status,
            notes
        });

        const transactionItems = items.map((item) => {
            return {
                id_transaction: transaction.id_transaction,
                id_items: item.id_items,
                quantity: item.quantity,
                // subtotal: item.subtotal,
            };
        });

        await TransactionItem.bulkCreate(transactionItems);
        return res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
}
);

router.get("/:id", authenticateJWT, async (req, res) => {
    const id_user = req.user.id;
    const id_transaction = req.params.id;
    if (!id_user || !id_transaction) {
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                // id_user,
                id_transaction,
            },
        });
        items = await TransactionItem.findAll({
            where: {
                id_transaction,
            },
        });
        const itemsIds = items.map((item) => item.id_items);
        const itemsResult = await ServiceItem.findAll({
            where: {
                id_items: itemsIds,
            },
        });
        itemData = items.map((item) => {
            const itemResult = itemsResult.find((result) => result.id_items == item.id_items);
            return {
                ...item.dataValues,
                ...itemResult.dataValues,
            };
        });
        transaction.dataValues.items = itemData;
        // get my review
        const review = await Review.findOne({
            where: {
                id_transaction,
            },
        });

        if (review) {
            transaction.dataValues.review = review;
        }
        return res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
},
);
// send payment proof by user (upload image)
router.post("/:id/payment-proof", authenticateJWT, upload.single("payment_proof"), async (req, res) => {
    const id_user = req.user.id;
    const id_transaction = req.params.id;
    const payment_proof = req.file.filename;
    if (!id_user || !id_transaction || !payment_proof) {
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                // id_user,
                id_transaction,
            },
        });
        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }
        // check if it's the same user or mitra level
        if (transaction.id_user != id_user && req.user.level != "mitra") {
            return res.status(401).send("Unauthorized");
        }
        transaction.payment_proof = payment_proof;
        await transaction.save();
        return res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
});
// update transaction status or payment status by admin
router.put("/:id", authenticateJWT, async (req, res) => {
    const id_transaction = req.params.id;
    const { status, payment_status } = req.body;
    // status and payment_status are optional
    if (!id_transaction) {
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                id_transaction,
            },
        });
        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }
        if (status) {
            transaction.status = status;
        }
        if (payment_status) {
            transaction.payment_status = payment_status;
        }
        await transaction.save();
        return res.status(200).send(transaction);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
}
);

router.post("/:id/review", authenticateJWT, async (req, res) => {
    const id_user = req.user.id;
    const id_transaction = req.params.id;
    const { rating, comment } = req.body;
    if (id_user == undefined || id_transaction == undefined || rating == undefined || !comment) {
        return res.status(400).send();
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                id_user,
                id_transaction,
            },
        });
        if (!transaction) {
            return res.status(404).send("Transaction not found");
        }
        const checkReview = await Review.findOne({
            where: {
                id_transaction,
            },
        });
        if (checkReview) {
            // update review
            checkReview.rating = rating;
            checkReview.comment = comment;
            await checkReview.save();
            return res.status(200).send(checkReview);
        } else {
            const reviewResult = await Review.create({
                id_user,
                id_transaction,
                rating,
                comment,
            });
            return res.status(200).send(reviewResult);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
});

module.exports = router;










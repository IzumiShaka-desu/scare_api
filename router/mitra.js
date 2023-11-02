const router = require("express").Router();
const { JwtService, authenticateJWT } = require("../service/jwt-service");
const MitraProfile = require("../data/models/mitra-profile");
const MitraRekening = require("../data/models/mitra-rekening");
const ServiceItem = require("../data/models/service-item");
const Review = require("../data/models/review");
const Transaction = require("../data/models/transaction");
const { uploadMitra, upload } = require("../service/upload-service");
const { Op } = require("sequelize");


const jwtService = new JwtService();

// filter type there is recommended, popular,allProducts,myProducts, and newest
const getReview = async (id) => {
    const transactions = await Transaction.findAll({
        where: {
            id_mitra: id,
        }
    });
    const transactionIds = transactions.map((transaction) => transaction.id_transaction);
    const review = await Review.findAll({
        where: {
            id_transaction: {
                [Op.in]: transactionIds,
            },
        },
    });
    return review;
}
router.get("/", authenticateJWT, async (req, res) => {
    // get query params [filterType(required), location(optional)]
    const { filterType } = req.query;
    try {
        if (!filterType) {
            return res.status(400).send();
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).send("Unauthorized");
        }
        // get Mitra thats service_list is contains filterType
        const mitraList = await MitraProfile.findAll({
            where: {
                service_list: {
                    [Op.like]: `%${filterType}%`,
                },
            },
        });

        // get review for each mitra
        for (let i = 0; i < mitraList.length; i++) {
            const mitra = mitraList[i];
            let rating = 0;
            const service_items = await ServiceItem.findAll({
                where: {
                    id_mitra: mitra.id_mitra,
                }
            });
            const reviews = await getReview(mitra.id_mitra);
            if (reviews.length > 0) {
                reviews.forEach((review) => {
                    rating += review.rating;
                });
                rating /= reviews.length;
            }
            mitra.dataValues.rating = rating;
            mitra.dataValues.service_items = service_items;
        }

        // send mitraList as response
        res.status(200).send(mitraList);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/my", authenticateJWT, async (req, res) => {


    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const mitra = await MitraProfile.findOne({
            where: {
                id_owner: userId,
            },
        });
        if (!mitra) {
            return res.status(404).send("mitra not found");
        }
        mitra.services = await ServiceItem.findAll({
            where: {
                id_mitra: mitra.id_mitra,
            }
        });
        let rating = 0;
        const reviews = await getReview(mitra.id_mitra);
        if (reviews.length > 0) {
            reviews.forEach((review) => {
                rating += review.rating;
            });
            rating /= reviews.length;
        }
        mitra.dataValues.rating = rating;
        res.status(200).send(mitra);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});


router.get("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const mitra = await MitraProfile.findOne({
            where: {
                id_owner: id,
            },
        });
        if (!mitra) {
            return res.status(404).send("mitra not found");
        }
        mitra.services = await ServiceItem.findAll({
            where: {
                id_mitra: mitra.id_mitra,
            }
        });
        const rating = 0;
        const reviews = await getReview(mitra.id_mitra);
        if (reviews.length > 0) {
            reviews.forEach((review) => {
                rating += review.rating;
            });
            rating /= reviews.length;
        }
        mitra.dataValues.rating = rating;
        res.status(200).send(mitra);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/:id/rekening", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const rekening = await MitraRekening.findAll({
            where: {
                id_mitra: id,
            },
        });
        if (!rekening) {
            return res.status(404).send("rekening not found");
        }
        res.status(200).send(rekening);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/:id/rekening", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { bank_name, account_number, account_name } = req.body;
    try {
        const rekening = await MitraRekening.create({
            id_mitra: id,
            bank_name: bank_name,
            account_number: account_number,
            account_name: account_name,
        });
        res.status(200).send(rekening);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.put("/:id/rekening/:id_rekening", authenticateJWT, async (req, res) => {
    const { id, id_rekening } = req.params;
    const { bank_name, account_number, account_name } = req.body;
    try {
        const rekening = await MitraRekening.findOne({
            where: {
                id_rekening: id_rekening,
                id_mitra: id,

            },
        });
        if (!rekening) {
            return res.status(404).send("rekening not found");
        }
        if (bank_name) {

            rekening.bank_name = bank_name;
        }
        if (account_number) {
            rekening.account_number = account_number;
        }
        if (account_name) {
            rekening.account_name = account_name;
        }
        await rekening.save();
        res.status(200).send(rekening);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.delete("/:id/rekening/:id_rekening", authenticateJWT, async (req, res) => {
    const { id, id_rekening } = req.params;
    try {
        const rekening = await MitraRekening.findOne({
            where: {
                id_rekening: id_rekening,
                id_mitra: id,
            },
        });
        if (!rekening) {
            return res.status(404).send("rekening not found");
        }
        await rekening.destroy();
        res.status(200).send({ "message": "rekening deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/:id/service", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const service = await ServiceItem.findAll({
            where: {
                id_mitra: id,
            },
        });
        if (!service) {
            return res.status(404).send("service not found");
        }
        res.status(200).send(service);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
);

router.post("/:id/service", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { service_name, price, service_type } = req.body;
    try {
        const service = await ServiceItem.create({
            id_mitra: id,
            service_name: service_name,
            price: price,
            service_type: service_type,
        });
        res.status(200).send(service);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.put("/:id/service/:id_service", authenticateJWT, async (req, res) => {
    const { id, id_service } = req.params;
    const { service_name, price, service_type } = req.body;
    try {
        const service = await ServiceItem.findOne({
            where: {
                id_items: id_service,
                id_mitra: id,
            },
        });
        if (!service) {
            return res.status(404).send("service not found");
        }
        service.service_name = service_name;
        service.price = price;
        service.service_type = service_type;
        await service.save();
        res.status(200).send(service);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.delete("/:id/service/:id_service", authenticateJWT, async (req, res) => {
    const { id, id_service } = req.params;
    try {
        const service = await ServiceItem.findOne({
            where: {
                id_items: id_service,
                id_mitra: id,
            },
        });
        if (!service) {
            return res.status(404).send("service not found");
        }
        await service.destroy();
        res.status(200).send("service deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/:id/review", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const review = await getReview(id);
        if (!review) {
            return res.status(404).send("Review not found");
        }
        res.status(200).send(review);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/", authenticateJWT, upload.single('image'), async (req, res) => {
    // get user id from payload
    const userId = req.user.id;
    const userLevel = req.user.level;
    console.log(req.user);
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    if (userLevel !== "mitra") {
        return res.status(401).send("Unauthorized");
    }
    // get body params
    const { name, address, service_list } = req.body;
    // get file
    const image = req.file;
    //  all params are required
    if (!name || !address || !service_list || !image) {
        return res.status(400).send();
    }
    console.log(image);

    console.log(image.filename);
    console.log(image.path);

    try {
        // create new mitra
        const mitra = await MitraProfile.create({
            id_owner: userId,
            mitra_name: name,
            address: address,
            service_list: service_list,
            profile_photo: image.filename,
        });
        // send mitra as response
        res.status(200).send(mitra);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }


});



router.put("/:id", authenticateJWT, upload.single('image'), async (req, res) => {

    const { id } = req.params;
    // get user id from payload
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    // get mitra
    const mitra = await MitraProfile.findOne({
        where: {
            id_mitra: id,
            id_owner: userId,
        },
    });

    if (!mitra) {
        return res.status(404).send("mitra not found");
    }

    // check is vehicle owned by user
    if (mitra.id_owner !== userId && payload.level !== "admin") {
        console.log(payload);
        console.log(`mitra owner: ${mitra.id_owner} user id: ${userId} and ${mitra.id_owner !== userId}`);
        return res.status(401).send("Unauthorized");
    }

    // get body params
    let { name, address, service_list } = req.body;
    // all params are optional
    // if params is not provided, use the old one
    name = name ? name : mitra.mitra_name;
    address = address ? address : mitra.address;
    service_list = service_list ? service_list : mitra.service_list;

    // image is optional
    const image = req.file;
    const imagePath = image ? image.filename : mitra.profile_photo;
    try {
        // update mitra
        await mitra.update({
            mitra_name: name,
            address: address,
            service_list: service_list,
            profile_photo: imagePath,
        });
        // send mitra as response
        res.status(200).send(mitra);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

});

router.delete("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    // get user id from payload
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    // check if mitra is owned by user
    const mitra = await MitraProfile.findOne({
        where: {
            id_mitra: id,
            id_owner: userId,
        },
    });
    if (!mitra) {
        return res.status(404).send("mitra not found");
    }
    // delete mitra
    await mitra.destroy();
    // send success message
    res.status(200).send("mitra deleted");
});

module.exports = router;
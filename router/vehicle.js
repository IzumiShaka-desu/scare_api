const router = require("express").Router();
const { JwtService, authenticateJWT } = require("../service/jwt-service");
const { Vehicle, getVehicle, getVehicleById } = require("../data/models/vehicle");
const upload = require("../service/upload-service");


const jwtService = new JwtService();

// filter type there is recommended, popular,allProducts,myProducts, and newest

router.get("/", authenticateJWT, async (req, res) => {
    // get query params [filterType(required), location(optional)]
    const { filterType, location } = req.query;
    try {
        if (!filterType) {
            return res.status(400).send();
        }

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).send("Unauthorized");
        }
        // get vehicles
        const vehicles = await getVehicle(filterType, userId, location);
        // send vehicles as response
        res.status(200).send(vehicles);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await getVehicleById(id);
        if (!vehicle) {
            return res.status(404).send("Vehicle not found");
        }
        vehicle.isMyVehicle = req.user.id === vehicle.owner.owner_id;
        console.log(req.user.id);
        console.log(vehicle);
        console.log(vehicle.owner.id_owner);
        res.status(200).send(vehicle);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/", authenticateJWT, upload.array('images', 10), async (req, res) => {
    // get body params
    const { brand, name, price, description, type, latitude, longitude } = req.body;
    // get files
    const images = req.files;
    // get token from header
    // const token = req.headers.authorization;
    // // verify token
    // const payload = jwtService.verifyToken(token);
    // // get user id from payload
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    if (!brand || !name || !price || !description || !type || !latitude || !longitude) {
        return res.status(400).send();
    }
    try {
        // create vehicle
        const vehicle = await Vehicle.create({
            id_owner: userId,
            brand: brand,
            name: name,
            price: price,
            description: description,
            type: type,
            latitude: latitude,
            longitude: longitude,
            images: images.map((image) => image.path),
        });
        // send vehicle as response
        res.status(201).send(vehicle);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }

});

router.put("/:id", authenticateJWT, upload.array('images', 10), async (req, res) => {
    const { id } = req.params;
    // get user id from payload
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    // get vehicle
    const vehicle = await Vehicle.findOne({
        where: {
            id_vehicle: id,
            id_owner: userId,
        },
    });

    if (!vehicle) {
        return res.status(404).send("Vehicle not found");
    }

    // check is vehicle owned by user
    if (vehicle.id_owner !== userId && payload.level !== "admin") {
        console.log(payload);
        console.log(`vehicle owner: ${vehicle.id_owner} user id: ${userId} and ${vehicle.id_owner !== userId}`);
        return res.status(401).send("Unauthorized");
    }

    // get body params
    let { brand, name, price, description, type, latitude, longitude, deletedImages } = req.body;
    // all params are optional
    // if params is not provided, use the old one
    brand = brand || vehicle.brand;
    name = name || vehicle.name;
    price = price || vehicle.price;
    description = description || vehicle.description;
    type = type || vehicle.type;
    latitude = latitude || vehicle.latitude;
    longitude = longitude || vehicle.longitude;

    // if deletedImages is not provided, use empty array
    deletedImages = deletedImages || [];
    // get files
    const images = req.files;
    // if images is not provided, use empty array
    let newImages = images || [];
    // remove deleted images and combine old images with new images and 
    const newImagePaths = vehicle.images.filter((image) => !deletedImages.includes(image)).concat(newImages.map((image) => image.path));

    // remove deleted images file
    deletedImages.forEach((image) => {
        fs.unlinkSync(image);
    });
    try {
        // update vehicle
        await vehicle.update({
            brand: brand,
            name: name,
            price: price,
            description: description,
            type: type,
            latitude: latitude,
            longitude: longitude,
            images: newImagePaths,
        });
        // send vehicle as response
        res.status(200).send(vehicle);
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
    // check if vehicle is owned by user
    try {
        const vehicle = await Vehicle.findOne({
            where: {
                id_vehicle: id,
            },
        });
        if (!vehicle) {
            return res.status(404).send("Vehicle not found");
        }
        if (req.user.level === "admin" || vehicle.id_owner === userId) {

            await vehicle.destroy();
            return res.status(200).send({ message: "Vehicle deleted" });
        }
        return res.status(401).send("Unauthorized");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
});

module.exports = router;
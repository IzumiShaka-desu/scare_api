const { JwtService, authenticateJWT } = require("../service/jwt-service");
const User = require("../data/models/user");
const bcrypt = require("bcrypt-nodejs");
const router = require("express").Router();

const jwtService = new JwtService();

const validatePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // check if username and password are set
    if (!email || !password) {
        return res.status(400).send();
    }
    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        console.log(user);

        if (!user) {
            return res.status(401).send("Invalid username or password");
        }
        if (validatePassword(password, user.password)) {
            const token = jwtService.generateToken(user);

            return res.status(200).send({ token });
        }
        return res.status(401).send("Invalid username or password");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went wrong");
    }
});
router.post("/register", async (req, res) => {
    const { name, phone, email, password, level } = req.body;

    if (!name || !phone || !email || !password || !level) {
        return res.status(400).send();
    }
    try {
        // check if user already exist
        const userExist = await User.findOne({
            where: {
                email,
            },
        });
        if (userExist) {
            return res.status(409).send("email already exist");
        }

        const user = await User.create({
            level: level,
            email: email,
            password: password,
            phone: phone,
            name: name,
        });
        if (!user) {
            return res.status(500).send("Something went wrong");
        }

        const token = jwtService.generateToken(user);

        res.status(201).send({ token });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }

});

// admin priviledge
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.destroy({
            where: {
                id_user: id,
            },
        });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});

// get all users
router.get("/", authenticateJWT, async (req, res) => {
    if (req.user.level !== "admin") {
        return res.status(401).send("Unauthorized");
    }

    try {
        const users = await User.findAll();
        if (!users) {
            return res.status(404).send("User not found");
        }
        users.forEach((user) => {
            user.password = undefined;
        });
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});
// get my profile
router.get("/me", authenticateJWT, async (req, res) => {
    const { id } = req.user;
    if (!id) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const user = await User.findOne({
            where: {
                id_user: id,
            },
        });
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.password = undefined;
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;

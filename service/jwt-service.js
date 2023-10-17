const jwt = require("jsonwebtoken");

class JwtService {
    constructor() {
        this.secret = process.env.JWT_SECRET || "my-secret";
    }

    generateToken(user) {
        const payload = {
            id: user.id_user,
            username: user.name,
            level: user.level,
        };

        return jwt.sign(payload, this.secret, {
            expiresIn: "8h",
        });
    }

    verifyToken(token) {
        console.log("verif");
        // remove Bearer from token if exist
        token = token.replace("Bearer ", "");
        return jwt.verify(token, this.secret);
    }

}
const jwtService = new JwtService();
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log(`njir ${authHeader}`);
    try {
        if (authHeader) {
            console.log("auth");
            const payload = jwtService.verifyToken(authHeader);
            req.user = payload;
            console.log("payload");
            next();
        } else {

            res.sendStatus(401);
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            res.status(401).send("Token expired");
        }
        if (err.name === "JsonWebTokenError") {
            res.status(401).send("Invalid token");
        }
        if (err.name === "Error") {
            res.status(401).send("Unauthorized");
        }
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
module.exports = { JwtService, authenticateJWT };
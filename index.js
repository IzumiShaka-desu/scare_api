const express = require("express");
const cors = require("cors");
const auth = require("./router/auth");
const vehicle = require("./router/vehicle");
const rent = require("./router/rent");
const message = require("./router/message");

const app = express();
console.log(process.env.DB_DATABASE);
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// app.post("/login", auth.login);

// app.post("/register", auth.register);
app.use("/auth", auth);
app.use("/vehicle", vehicle);
app.use("/rent", rent);
app.use("/message", message);
// path for showing image
app.use("/images", express.static(__dirname + "/uploads"));
app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
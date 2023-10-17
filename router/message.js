const router = require("express").Router();
const { JwtService, authenticateJWT } = require("../service/jwt-service");
const Messages = require("../data/models/messages");
const { Op } = require("sequelize");
const { ChatRooms, getChatRooms, sentMessage, getAllMessages, findChatroom } = require("../data/models/chat-rooms");

const jwtService = new JwtService();

router.get("/", authenticateJWT, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }
    const chatrooms = await getChatRooms(userId);

    res.status(200).send(chatrooms);
});

// post when user initially chat with another user
router.post("/", authenticateJWT, async (req, res) => {
    const { userId, message, sentAt } = req.body;

    const senderId = req.user.id;
    if (!userId) {
        return res.status(400).send();
    }
    // cannot chat with yourself
    if (userId === senderId) {
        return res.status(400).send();
    }
    try {
        if (!message) {
            const checkRoom = await findChatroom([userId, senderId], true);
            if (checkRoom) {
                let room;
                // if checkRoom is array, then it is not empty
                if (Array.isArray(checkRoom)) {
                    room = checkRoom[0];
                } else {
                    room = checkRoom;
                }
                console.log(checkRoom);
                console.log(room);
                if (room) {
                    const response = await getAllMessages(room.id_room, senderId);
                    return res.status(201).send(response);
                }


            }
            return res.status(404).send();
        }
        // check if chat room already exist
        // const membersA = JSON.stringify([userId, senderId]);
        // const membersB = JSON.stringify([senderId, userId]);
        const checkRoom = await findChatroom([userId, senderId], true);
        if (checkRoom) {
            let room;
            // if checkRoom is array, then it is not empty
            if (Array.isArray(checkRoom)) {
                room = checkRoom[0];
            } else {
                room = checkRoom;
            }
            console.log(checkRoom);
            console.log(room);
            if (room) {
                const response = await sentMessage(senderId, room.id_room, message, sentAt);

                return res.status(201).send(response);
            }
        }
        const room = await ChatRooms.create({
            members: [userId, senderId],
        });
        console.log(room);
        const response = await sentMessage(senderId, room.id_room, message, sentAt);

        res.status(201).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.get("/:id", authenticateJWT, async (req, res) => {
    const roomId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const messages = await getAllMessages(roomId, userId);

        res.status(200).send(messages);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.post("/:id", authenticateJWT, async (req, res) => {
    const roomId = req.params.id;
    const { message, sentAt } = req.body;

    const userId = req.user.id;

    if (!userId) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const response = await sentMessage(userId, roomId, message, sentAt);

        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;

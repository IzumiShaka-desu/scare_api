const sequelize = require("../db/db");
const { Sequelize, DataTypes, Model } = require('sequelize');
const Messages = require("./messages");
const User = require("./user");

const { Op } = require("sequelize");

const ChatRooms = sequelize.define(
    "ChatRooms",
    {
        id_room: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        members: {
            type: DataTypes.JSON,
        },
    },
);
const findChatroom = async (members, isSingle = false) => {
    // SELECT * FROM chatrooms WHERE JSON_CONTAINS(members, '[3, 4]');
    return await sequelize.query(
        `SELECT * FROM chatrooms WHERE JSON_CONTAINS(members, '[${members}]') ${isSingle ? "LIMIT 1" : ""}`,
        {
            type: sequelize.QueryTypes.SELECT,
        }
    );
}

const getChatRooms = async (userId) => {
    // get all chatrooms where user is a member
    // members is a JSOn array

    const rooms = await findChatroom([userId]);
    const roomIds = rooms.map((room) => room.id_room);
    // get last message from each room
    const messages = await Messages.findAll({
        where: {
            id_room: {
                [Op.in]: roomIds,
            },
        },
        order: [["createdAt", "DESC"]],
        // group: ["id_room"],
    });
    const roomMembersId = rooms.map((room) => room.members).flat();
    const roomMembers = await User.findAll({
        where: {
            id_user: {
                [Op.in]: roomMembersId,
            },
        },
    });
    const members = roomMembers.map((member) => {
        return {
            userId: member.id_user,
            userName: member.name,
            photoProfile: member["photo-profile"],
        };
    });
    console.log(members);
    let chatrooms = rooms.map((room) => {
        const roomMessages = messages.filter(
            (message) => message.id_room === room.id_room
        );
        const formattedMessages = roomMessages.map((message) => {
            return {
                messageId: message.id_message,
                message: message.message,
                sender: members.find(
                    (member) => member.userId === message.id_sender
                ),
                sentAt: message.createdAt,
            };
        });
        const memberThisRoom = members.filter((member) => room.members.includes(member.userId));
        console.log(memberThisRoom);
        console.log(room.members);
        const roomPartner = memberThisRoom.filter((member) => member.userId !== userId)[0]
        return {
            roomId: room.id_room,
            roomName: roomPartner.userName,
            members: memberThisRoom,
            messages: formattedMessages,
        };
    });
    console.log(chatrooms);
    return chatrooms;
}
const getAllMessages = async (roomId, userId) => {
    try {
        const room = await ChatRooms.findOne({
            where: {
                id_room: roomId,
            },
        });
        const roomMembers = room.members;
        const memberProfile = await User.findAll({
            where: {
                id_user: {
                    [Op.in]: roomMembers,
                },
            },
        });
        const roomMessages = await Messages.findAll({
            where: {
                id_room: roomId
            },
            order: [["createdAt", "DESC"]],
        });
        const members = memberProfile.map((member) => {
            return {
                userId: member.id_user,
                userName: member.name,
                photoProfile: member["photo-profile"],
            };
        });
        console.log(members);
        const formattedMessages = roomMessages.map((message) => {
            return {
                messageId: message.id_message,
                message: message.message,
                sender: members.find(
                    (member) => member.userId === message.id_sender
                ),
                sentAt: message.createdAt,
            };
        });
        const roomPartner = members.filter((member) => member.userId !== userId)[0]
        return {
            roomId: room.id_room,
            roomName: roomPartner.userName,
            members,
            messages: formattedMessages,
        };
    } catch (err) {
        console.log(err);
        return null;
    }
}
// return a chatroom with all messages
const sentMessage = async (userId, roomId, message, sentAt) => {
    try {
        const room = await ChatRooms.findOne({
            where: {
                id_room: roomId,
            },
        });
        console.log("njir coek");
        console.log(room);
        if (!room.members.includes(userId)) {
            return null;
        }
        const newMessage = await Messages.create({
            id_room: roomId,
            id_sender: userId,
            message,
            sentAt,
        });
        return await getAllMessages(roomId, userId);
    } catch (err) {
        console.log(err);
        return null;
    }
}


module.exports = { ChatRooms, getChatRooms, sentMessage, getAllMessages, findChatroom };
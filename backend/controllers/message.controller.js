import Conversation from "./../models/conversation.model.js";
import Message from "./../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("sendMessage controller: ", message, req.body);
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log(receiverId, senderId.toString());

    if (receiverId === senderId)
      return res
        .status(400)
        .json({ error: "senderId and receiverId cannot be the same" });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.message.push(newMessage._id);

    // SOCKET IO FUNCTIONALITY WILL GO HERE

    // await conversation.save();
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    console.log(userToChatId, senderId);

    if (userToChatId === senderId.toString())
      return res
        .status(400)
        .json({ error: "senderId and receiverId cannot be the same" });

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("message");

    return res.status(200).json(conversation.message);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

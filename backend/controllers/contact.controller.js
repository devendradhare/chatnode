import User from "./../models/user.model.js";
import Conversation from "./../models/conversation.model.js";
export const getContacts = async (req, res) => {
  console.log("getContacts req");
  try {
    const loggedInUserId = req.user._id;
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    const usersWithMessages = [];

    for (let user of allUsers) {
      const userObj = user.toObject(); // Convert Mongoose document to plain JS object
      const conversation = await Conversation.findOne({
        participants: { $all: [loggedInUserId, user._id] },
      }).populate("message");
      userObj.messages = conversation?.message || [];
      usersWithMessages.push(userObj);
    }
    return res.status(200).json(usersWithMessages);
  } catch (error) {
    console.log("Error in contact controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

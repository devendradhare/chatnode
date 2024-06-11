import User from "./../models/user.model.js";
export const getContacts = async (req, res) => {
  console.log("getContacts req");
  try {
    const loggedInUserId = req.user._id;
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    return res.status(200).json(allUsers);
  } catch (error) {
    console.log("Error in contact controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("getContacts");
};

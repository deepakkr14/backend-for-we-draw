const User = require("../models/user");
const mongoose = require("mongoose");
exports.getSentbox = async (req, res, next) => {
  const reciever = req.params.username;
  try {
    const data = await User.find(
      { username: reciever },
      { sentbox: 1, _id: 0 }
    );
    res.status(200).send(data[0].sentbox);
  } catch (error) {
    console.log(error);
  }
};
exports.addSentbox = async (req, res, next) => {
  const receiver = req.params.username;
  const messageData = req.body;
  // const mysentmsg= {
  //   content: "i am a tet mail 1",
  //   date: { day: 26, month: 2, year: 2024 },
  //   subject: "test mails",
  //   time: { hours: 18, minutes: 44 },
  //   to: "wimobos186",
  //   toMail: "wimobos186@finghy.com",
  // }
  console.log("finding theh users");
  try {
    const user = await User.findOne({ username: receiver });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const message = {
      _id: new mongoose.Types.ObjectId(),
      ...messageData,
    };
    user.sentbox.push(message);
    await user.save();
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while adding message to sentbox" });
  }
};

exports.deleteSentbox = async (req, res, next) => {
  //${userName}/inbox/${mail.id}
  let mailId = req.params.mailId;
  let username = req.params.username;
  try {
    const result = await User.findOneAndUpdate(
      { username: username },
      { $pull: { sentbox: { _id: mailId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("No user with this email found");
    } else {
      res.status(200).json({status: 'Deleted from sentbox'});
    }
  } catch (error) {
    console.log(error);
  }
};

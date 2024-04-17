const User = require("../models/user");
const mongoose = require("mongoose");

exports.getInbox = async (req, res, next) => {
  const username = req.params.username;
  try {
    User.findOne({ username: username }).then((user) => {
      if (!user) {
        const user = new User({
          username: username.split("@")[0],
          email: `${username}@gmail.com`,
        });
        user.save();
      }
    });

    const data = await User.find({ username: username }, { inbox: 1, _id: 0 });
    res.status(200).send(data[0].inbox);

  } catch (error) {
    console.log(error);
  }
};

exports.addInbox = async (req, res, next) => {
  const reciever = req.params.username;
  console.log(reciever);
  const messageData = req.body;
  // const receiverMessage = {
  //   content: "dummy",
  //   date: { day: 26, month: 2, year: 2024 },
  //   from: "wimobos186",
  //   fromMail: "wimobos186@finghy.com",
  //   id: "-Nr_hriplB604eXCqmin",
  //   isRead: true,
  //   subject: "test mails",
  //   time: { hours: 19, minutes: 28 },
  // };
  try {
    const user = await User.findOne({ username: reciever });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const message = {
      _id: new mongoose.Types.ObjectId(),
      ...messageData,
    };
    user.inbox.push(message);
    await user.save();
    console.log(message._id);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while adding message to inbox" });
  }
};

exports.deleteInbox = async (req, res, next) => {
  //${userName}/inbox/${mail.id}
  let mailId = req.params.mailId;
  let userName = req.params.username;
  console.log(mailId, userName, "i am update from inbox");
  try {
    // add to the trash
    const user = await User.findOne({ username: userName });
    const data = await user.inbox.filter((x) => x._id == mailId);
    user.trash.push(data[0]);
    await user.save();
    // delete from inbox
    const result = await User.findOneAndUpdate(
      { username: userName },
      { $pull: { inbox: { _id: mailId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("No user with this email found");
    } else {
      res.status(200).json({ status: "Deleted" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateInbox = async (req, res, next) => {
  let mailId = req.params.mailId;
  let username = req.params.username;
  try {
    const result = await User.findOneAndUpdate(
      { username: username, "inbox._id": mailId },
      { $set: { "inbox.$.isRead": true } },
      { new: true }
    );
    if (!result) {
      return res.status(404).send("No user with this email found");
    } else {
      res.status(200).json({ sucess: true });
    }
  } catch (error) {
    console.log(error);
  }
};

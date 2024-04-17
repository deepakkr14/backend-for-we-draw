const User = require("../models/user");
const cron = require("node-cron");

exports.getT = async (req, res, next) => {
  const username = req.params.username;
  try {
    const data = await User.find({ username: username }, { trash: 1, _id: 0 });
    res.status(200).send(data[0].trash);
  } catch (error) {
    console.log(error);
  }
};
exports.addTrash = async (req, res, next) => {
  const username = req.params.username;
  const messageData = req.body;
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const message = {
      _id: new mongoose.Types.ObjectId(),
      ...messageData,
    };
    user.trash.push(message);
    await user.save();
    console.log(message._id);
    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while adding message to trash" });
  }
};
const deleteOldMessagesJob = cron.schedule(
  "0 0 * * *",
  () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Calculate the date 30 days ago
    Message.deleteMany({ createdAt: { $lt: thirtyDaysAgo } })
      .then((result) => {
        console.log(`${result.deletedCount} old messages deleted.`);
      })
      .catch((error) => {
        console.error("Error deleting old messages:", error);
      });
  },
  {
    scheduled: true,
    timezone: "IST", // Replace with your timezone
  }
);

// Start the cron job
deleteOldMessagesJob.start();

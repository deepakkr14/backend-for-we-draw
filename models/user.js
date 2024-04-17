const mongoose = require('mongoose');
const { Schema } = mongoose;

const mailSchema = new Schema({
  content: String,
  date: {
    day: Number,
    month: Number,
    year: Number
  },
  from: String,
  fromMail: String,
  id: String,
  isRead: Boolean,
  subject: String,
  time: {
    hours: Number,
    minutes: Number
  },
  to: String,
  toMail: String
});


const userSchema = new Schema({
  username: String,
  email: String,
  inbox: {
    type: [mailSchema],
    default: []
  },
  sentbox: {
    type: [mailSchema],
    default: []
  },
  trash: {
    type: [mailSchema],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);




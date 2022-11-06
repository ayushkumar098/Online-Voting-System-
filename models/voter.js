const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  voterId: String,
  constituencyId: String,
  passportNo: String,
  country: String,
  mobileNo: Number,
  electionsVoted: [String],
  imgUrl: String,
  imgDesc: String,
});

module.exports = new mongoose.model("Voter", voterSchema);
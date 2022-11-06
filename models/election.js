const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  electionId: Number,
  electionName: String,
  voters:[String]
});

module.exports = new mongoose.model("Election", electionSchema);

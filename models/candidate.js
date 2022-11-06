const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  electionId: Number,
  candidateId: String,
  name: String,
  ConstituencyId: Number,
  party: String,
  logo: String,
  vote: [String],
});

module.exports = new mongoose.model("Candidate", candidateSchema);
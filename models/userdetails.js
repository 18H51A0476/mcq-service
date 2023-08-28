const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test", // Reference to the Test model
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  }
});

const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = UserDetails;

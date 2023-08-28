const mongoose = require("mongoose");

const userResponseSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails", // Reference to the UserDetails model
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mcq", // Reference to the Mcq model
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
});

const UserResponse = mongoose.model("UserResponse", userResponseSchema);

module.exports = UserResponse;

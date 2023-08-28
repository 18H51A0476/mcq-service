const mongoose = require('mongoose');

// Define the MCQ schema
const mcqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    option1: {
      type: String,
      required: true,
    },
    option2: {
      type: String,
      required: true,
    },
    option3: {
      type: String,
      required: true,
    },
    option4: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the MCQ model from the schema
const Mcq = mongoose.model('Mcq', mcqSchema);

// Export the MCQ model
module.exports = Mcq;

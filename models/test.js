const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
    },
    testStatus: {
      type: Boolean,
      default: false, // Set the default status as false
    },
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

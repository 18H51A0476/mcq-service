const mongoose = require('mongoose');

const mappingSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  mcq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mcq',
    required: true,
  },
});

const Mapping = mongoose.model('Mapping', mappingSchema);

module.exports = Mapping;
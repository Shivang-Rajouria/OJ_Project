const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true } // expected output
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  testCases: [testCaseSchema]
});

module.exports = mongoose.model('Problem', problemSchema);

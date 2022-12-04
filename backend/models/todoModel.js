const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    tasks: [{ type: String }],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Todo', todoSchema);

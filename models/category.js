const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    products:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Product",
    }],
    value:{
      type: String,
      required: true
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
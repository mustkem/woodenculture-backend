const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  phone_num: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "true",
  },
  wishlist: [
    {
      productId:{
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      status:{
        type:Boolean,
      }
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

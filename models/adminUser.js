const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        },
    phone: {
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
        type: Boolean,
        default: true,
    },
    is_superuser: {
        type: Boolean,
        default: false,
    },
  
});

module.exports = mongoose.model("AdminUser", adminUserSchema);

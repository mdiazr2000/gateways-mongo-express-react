const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null, required:true },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, required:true , unique: true},
    password: { type: String, required:true },
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
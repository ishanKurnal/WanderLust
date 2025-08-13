const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");  // Plugin to simplify username/password authentication with Mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Attaches username, hash, and salt fields + helper methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
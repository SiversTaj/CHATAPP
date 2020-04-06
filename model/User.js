const mongoose = require("mongoose");

// schema with ID, SENDER, RECEIVER, MESSAGE.
const UserSchema = new mongoose.Schema({
    Sender: {
        type: String,
        require: true
    },
    Message: {
        type: String,
        require: true
    },
    Room: {
        type: String,
        require: true
    },
    Time: {
        type: String,
        require: true
    }
});



// create model
const User = mongoose.model('User', UserSchema, 'Users');

//export to world to use
module.exports = User;
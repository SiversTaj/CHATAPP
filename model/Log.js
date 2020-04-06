const mongoose = require("mongoose");

//Schema with LOG type, name, message, time
const LogSchema = new mongoose.Schema({
    LogType: {
        type: String,
        require: true
    },
    Name: {
        type: String,
        require: true
    },
    Message: {
        type: String,
        require: true
    },
    Time: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Log', LogSchema);
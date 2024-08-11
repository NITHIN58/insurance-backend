const { default: mongoose } = require("mongoose");

const messageDateSchema = new mongoose.Schema({
    day: String,
    time: String,
    message: String


});

const MessageDateTime = mongoose.model("MessageDateTime", messageDateSchema)

module.exports = {
    MessageDateTime
}
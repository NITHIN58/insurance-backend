const { responseMessage } = require("../lib/common");
const { MessageDateTime } = require("../models/messageDateModel");

exports.messageDateTime = async (req, res) => {
    const { message, day, time } = req.body;
    const data = { message, day, time };
    if(!message || !day || !time) {
        return responseMessage(res, 400, "Message, day, and time are required");
    }
    try {
        const result = await MessageDateTime.create(data);
        return responseMessage(res, 200, "Data inserted successfully", result);
    } catch (error) {
        return responseMessage(res, 400, error.message);
    }
}
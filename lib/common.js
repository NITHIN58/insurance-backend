exports.responseMessage =(res, statusCode, message)=> {
    return res.status(statusCode).json({
        status: statusCode,
        message: message
    });
}

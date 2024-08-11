const { responseMessage } = require("../lib/common");
const { Worker} = require("worker_threads");
const path = require("path");


exports.upload = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return responseMessage(res, 400, "File not found");
    }

    const fileType = file.mimetype;
    const workerPath = path.resolve(__dirname, "./uploadWorker.js");
    const worker = new Worker(workerPath, {
      workerData: { filePath: file.path, fileType },
    });

    worker.on("message", (message) => {
      if (message.status === "success") {
        responseMessage(res, 200, "Data upload complete");
      } else {
        responseMessage(res, 400, message.error);
      }
    });

    worker.on("error", (error) => {
      responseMessage(res, 400, error.message);
    });

    // worker.on("exit", (code) => {
    //   if (code !== 0) {
    //     responseMessage(res, 400, `Worker stopped with exit code ${code}`);
    //   }
    // });
  } catch (error) {
    return responseMessage(res, 400, error.message);
  }
};

const { workerData, parentPort } = require("worker_threads");
const UploadModel = require("../models/uploadModel");
const csv = require("csv-parser");
const fs = require("fs");
const xlsx = require("xlsx");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");


// Load environment variables
dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect to MongoDB
mongoose.connect(database)
  .then(() => console.log('Worker: DB connection successful'))
  .catch(err => {
    console.error('Worker: DB connection error:', err);
    parentPort.postMessage({ status: "error", error: err.message });
  });


/**
 * This function takes an array of results and transforms it into 
 * objects that can be used to insert data into the database.
 *
 * @param {Array} results - An array of objects containing data to be processed.
 * @return {Object} An object containing arrays of userData, userAccounts, 
 * policyCategories, policyCarriers, policyInfos, and agents.
 */
const makeData = (results) => {
  console.log("results", results[0]);
    const userData = results.map((result) => ({
      firstName: result.firstname,
      dob: new Date(result.dob),
      address: result.address,
      phoneNumber: result.phone,
      state: result.state,
      zipCode: result.zip,
      email: result.email,
      gender: result.gender,
      userType: result.userType,
      policy_number : result.policy_number
       
    }));
    const userAccounts = results.map((result) => ({
      accountName: result.account_name,
    }));
    const policyCategories = results.map((result) => ({
      categoryName: result.category_name,
    }));
    const policyCarriers = results.map((result) => ({
      companyName: result.company_name,
    }));
    const policyInfos = results.map((result, index) => ({
      policyNumber: result.policy_number,
      premiumAmount: result.premium_amount,
      policyStartDate: new Date(result.policy_start_date),
      policyEndDate: new Date(result.policy_end_date),     
    }));
    const agents = results.map((result) => ({
      name: result.agent,
    }));
    return { userData, userAccounts, policyCategories, policyCarriers, policyInfos, agents };
  };
  
  const processCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  };
  
  const processXLSX = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  };

  const uploadData = async (data) => {
    const { userData, userAccounts, policyCategories, policyCarriers, policyInfos, agents } = makeData(data);

    // Insert users, accounts, categories, and carriers first to get their _ids
    const insertedUsers = await UploadModel.User.insertMany(userData);
    const insertedAccounts = await UploadModel.UserAccount.insertMany(userAccounts);
    const insertedCategories = await UploadModel.PolicyCategory.insertMany(policyCategories);
    const insertedCarriers = await UploadModel.PolicyCarrier.insertMany(policyCarriers);
    const insertedAgents = await UploadModel.Agent.insertMany(agents);

    // Now that we have the inserted documents, map them to their original data
    const policyInfosWithIds = policyInfos.map((info, index) => ({
      ...info,
      categoryId: insertedCategories[index]._id,
      companyId: insertedCarriers[index]._id,
      userId: insertedUsers[index]._id,
      agentId: insertedAgents[index]._id, // Assuming you're storing the agent reference as well
    }));

    // Insert policy information with the correct references
    await UploadModel.PolicyInfo.insertMany(policyInfosWithIds);
  };

  (async () => {
    try {
      const { filePath, fileType } = workerData;
      let data;
  
      if (fileType === "text/csv") {
        data = await processCSV(filePath);
      } else if (fileType.startsWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
        data = await processXLSX(filePath);
      }
  
      if (data && data.length > 0) {
        await uploadData(data);
      }
  
      parentPort.postMessage({ status: "success" });
    } catch (error) {
      parentPort.postMessage({ status: "error", error: error.message });
    }
  })();
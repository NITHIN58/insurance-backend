const { responseMessage } = require("../lib/common");
const { PolicyInfo, User } = require("../models/uploadModel");


exports.getPolicyInfo = async (req, res) => {
    try {
      const { userName } = req.params;
      console.log(req.params);
      const userInfo = await User.findOne({ firstName: userName });
      if(!userInfo ) throw new Error("User not found");

      const result = await PolicyInfo.find({ userId: userInfo._id });

      return responseMessage(res, 200, "Policy Info", result); 
    } catch (error) {
      return responseMessage(res, 400, error.message);
    }
  }

exports.getPolicyAggregate = async (req, res) => {
    try {
      const result = await PolicyInfo.aggregate([
        {
          $group: {
            _id: {
              userId: "$userId",
            },
            totalPremium: { $sum: "$premiumAmount" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $group: {
            _id: "$user.firstName",
            totalPremium: { $sum: "$totalPremium" },
          },
        },
      ]);
      console.log(result);
      return responseMessage(res, 200, "Policy Aggregate by user", result);
    } catch (error) {
      return responseMessage(res, 400, error.message);
    }
  }

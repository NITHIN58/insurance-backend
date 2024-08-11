const mongoose = require("mongoose");

// Agent Schema
const agentSchema = new mongoose.Schema({
  name: String,
});

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  dob: Date,
  address: String,
  phoneNumber: String,
  state: String,
  zipCode: String,
  email: String,
  gender: String,
  userType: String,
});

// User's Account Schema
const userAccountSchema = new mongoose.Schema({
  accountName: String,
});

// Policy Category (LOB) Schema
const policyCategorySchema = new mongoose.Schema({
  categoryName: String,
});

// Policy Carrier Schema
const policyCarrierSchema = new mongoose.Schema({
  companyName: String,
});

// Policy Info Schema
const policyInfoSchema = new mongoose.Schema({
  policyNumber: String,
  policyStartDate: Date,
  policyEndDate: Date,
  premiumAmount: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCategory' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCarrier' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
});

// Register Schemas with Mongoose
const Agent = mongoose.model("Agent", agentSchema);
const User = mongoose.model("User", userSchema);
const UserAccount = mongoose.model("UserAccount", userAccountSchema);
const PolicyCategory = mongoose.model("PolicyCategory", policyCategorySchema);
const PolicyCarrier = mongoose.model("PolicyCarrier", policyCarrierSchema);
const PolicyInfo = mongoose.model("PolicyInfo", policyInfoSchema);

module.exports = {
  Agent,
  User,
  UserAccount,
  PolicyCategory,
  PolicyCarrier,
  PolicyInfo,
};
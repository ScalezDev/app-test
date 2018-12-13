const mongoose = require('mongoose');

const { Schema } = mongoose;

const CustomerSchema = new Schema({
  inShopId: String,
  firstName: String,
  lastName: String,
  totalSpent: Number,
});

const MerchantSchema = new Schema({
  domain: String,
  accessToken: String,
  customers: [CustomerSchema],
});

const Merchant = mongoose.model('merchant', MerchantSchema);

module.exports = Merchant;

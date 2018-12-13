const mongoose = require('mongoose');

const { Schema } = mongoose;

const MerchantSchema = new Schema({
  domain: String,
  accessToken: String,
});

const Merchant = mongoose.model('merchant', MerchantSchema);

module.exports = Merchant;

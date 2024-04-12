import mongoose from 'mongoose';

const CreditDeductionsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },
    credits: {
      type: Number,
      default: 0,
      required: [true, 'Credits is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
  },
  { timestamps: true },
);

const CreditPurchases = mongoose.model('CreditPurchases', CreditDeductionsSchema);

module.exports = { CreditPurchases };

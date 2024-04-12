import mongoose from 'mongoose';

const CreditPurchasesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },
    type:{
      type: String,
      required: [true, 'Type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    credits: {
      type: Number,
      default: 0,
      required: [true, 'Credits is required'],
    },
    plan: {
      type: String,
      required: [true, 'Plan is required'],
    },
    shop: {
      type: String,
      required: [true, 'Shop is required'],
    },
    invoiceId: {
      type: String,
      required: [true, 'Invoice Id is required'],
    },
    webhookId: {
      type: String,
      required: [true, 'Webhook Id is required'],
    },
  },
  { timestamps: true },
);

const CreditPurchases = mongoose.model('CreditPurchases', CreditPurchasesSchema);

export default CreditPurchases;
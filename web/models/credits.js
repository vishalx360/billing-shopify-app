import mongoose from 'mongoose';

const CreditsSchema = mongoose.Schema(
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
    last_deducted: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Credits = mongoose.model('Credits', CreditsSchema);

export default Credits;
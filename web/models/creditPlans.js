import mongoose from 'mongoose';

const CreditPlansSchema = mongoose.Schema(
  {
    plan: {
      type: String,
      required: [true, 'Plan is required'],
    },
    Description: {
      type: String,
      required: [true, 'Description is required'],
    },
    credits: {
      type: Number,
      default: 0,
      required: [true, 'Credits is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    image: {
      type: String,
      // required: [true, 'Image is required'],
      default:"https://cdn.pixabay.com/photo/2018/06/11/09/54/game-3468135_1280.png"
    },
  },
  { timestamps: true },
);

const CreditPlans = mongoose.model('CreditPlans', CreditPlansSchema);

export default CreditPlans;
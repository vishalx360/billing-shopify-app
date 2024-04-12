import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    shop: {
      type: String,
      required: [true, 'Shop is required'],
      unique: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;

import Credits from "../models/credits.js";
import User from "../models/user.js";

export const userCreator = async (req, res, next) => {
  const session = res.locals.shopify.session;
  try {
    //fetch user from db
    const user = await User.findOne({ shop: session.shop });
    if (!user) {
      //create user
      console.log(
        `======> User not found for shop ${session.shop}. Creating a new user`
      );
      const newUser = await User.create({ shop: session.shop });
      await Credits.create({
        user: newUser._id,
      });
      console.log(`======> New user created for shop ${session.shop}`, newUser);
      req.user = newUser;
    }
    console.log(
      `======> User found for shop ${session.shop}. Fetching user data`
    );
    req.user = user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ error: "Internal server error" });
  }
};

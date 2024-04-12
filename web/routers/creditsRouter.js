import express from "express";
import CreditPlans  from "../models/creditPlans.js";
import CreditPurchases from "../models/creditPurchases.js";
import Credits from "../models/credits.js";
import User from "../models/user.js";
import shopify from "../config/shopify.js";
import { billingConfig } from "../config/billing.js";

const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Route for getting list of all plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await CreditPlans.find();
    res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route for selecting a plan and generating invoice
router.post("/purchase/plan", async (req, res) => {
  try {
    const { planId } = req.body;
    const selectedPlan = await CreditPlans.findById(planId);
    if (!selectedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    const session = res.locals.shopify.session;

    const invoiceUrl = await shopify.api.billing.request({
      session,
      plan: selectedPlan.plan,
      isTest: true, // TODO: Remove this in production
    });

    res.status(200).json({ invoiceUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Webhook route to handle purchase records
export const PaymentWebhookHandler = async ({
  topic,
  shop,
  payload,
  webhookId,
}) => {
  try {
    console.log("1. Webhook received:", { topic, shop, payload, webhookId });

    const { name, status } = payload.app_purchase_one_time;
    const {
      admin_graphql_api_shop_id,
      admin_graphql_api_id,
      created_at,
      updated_at,
    } = payload.app_purchase_one_time;

    console.log("2. Purchase details:", { name, status });

    // Fetch selected plan details
    const selectedPlan = await CreditPlans.findOne({ plan: name });

    console.log("3. Selected plan:", selectedPlan);

    if (!selectedPlan) {
      console.log("4. Selected plan not found");
      return false;
    }

    // Calculate total credits and price
    const totalCredits = selectedPlan.credits;
    const totalPrice = selectedPlan.price;

    console.log("5. Total credits:", totalCredits);
    console.log("6. Total price:", totalPrice);

    // get db user
    const user = await User.findOne({ shop });

    console.log("7. User:", user);

    // Deduct credits from user's balance
    let userCredits = await Credits.findOne({ user });
    if (!userCredits) {
      userCredits = new Credits({
        user: user._id,
        credits: totalCredits,
      });
    } else {
      userCredits.credits += totalCredits;
    }
    await userCredits.save();

    console.log("8. User credits:", userCredits);

    // Create purchase record
    const purchase = new CreditPurchases({
      user,
      shop,
      type: "purchase",
      amount: totalPrice,
      credits: totalCredits,
      plan: selectedPlan.plan,
      invoiceId: admin_graphql_api_id,
      webhookId,
    });
    await purchase.save();

    console.log("9. Purchase record created:", purchase);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Route for getting current balance
router.get("/balance", async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated
    const userCredits = await Credits.findOne({ user: userId });

    if (!userCredits) {
      return res.status(404).json({ message: "User credits not found" });
    }
    res.status(200).json({ balance: userCredits.credits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route for getting active subscriptions
router.get("/activePurchases", async (req, res) => {
  try {
    const plans = Object.keys(billingConfig);
    const session = res.locals.shopify.session;
    const activePurchases = await shopify.api.billing.check({
      session,
      isTest: true,
      plans: plans,
      returnObject: true,
    });
    res.status(200).json({ activePurchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route for getting all user purchases
router.get("/purchases", async (req, res) => {
  try {
    console.log("User:", req.user);
    const userId = req.user?._id; // Assuming user is authenticated
    const purchases = await CreditPurchases.find({ user: userId });
    res.status(200).json({ purchases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

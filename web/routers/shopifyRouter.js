import express from "express";
import shopify from "../config/shopify.js";
import webhookHandlers from "../config/webhookHandlers.js";

const router = express.Router();

// AUTHENTICATION -----
router.get(shopify.config.auth.path, shopify.auth.begin());
// AUTH CALLBACK -----
router.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
// WEBHOOKS -----
router.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers})
);


export default router;


 // MIDDLEWARE : Request payment if required
  // async (req, res, next) => {
  //   const plans = Object.keys(billingConfig);
  //   const session = res.locals.shopify.session;
  //   const hasPayment = await shopify.api.billing.check({
  //     session,
  //     plans: plans,
  //     isTest: true,
  //   });

  //   if (hasPayment) {
  //     next();
  //   } else {
  //     res.redirect(
  //       await shopify.api.billing.request({
  //         session,
  //         plan: plans[0],
  //         isTest: true,
  //       })
  //     );
  //   }
  // },
  // Load the app otherwise
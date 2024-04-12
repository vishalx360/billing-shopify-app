import { DeliveryMethod } from "@shopify/shopify-api";
import { PaymentWebhookHandler } from "../routers/creditsRouter.js";

export default {
  APP_PURCHASES_ONE_TIME_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      await PaymentWebhookHandler({
        topic, shop, payload, webhookId
      })
    }
  },
};

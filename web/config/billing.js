import { BillingInterval } from "@shopify/shopify-api";

export const billingConfig = {
  basic: {
    amount: 100,
    currencyCode: "INR",
    interval: BillingInterval.OneTime,
    usageTerms: "100 credits",
  },
  pro: {
    amount: 125,
    currencyCode: "INR",
    interval: BillingInterval.OneTime,
    usageTerms: "150 credits",
  },
  ultra: {
    amount: 250,
    currencyCode: "INR",
    interval: BillingInterval.OneTime,
    usageTerms: "500 credits",
  },
};

export const additionalBillingConfig = {
  basic: {
    description:"Get started with the basic plan and get access to a limited number of credits.",
  },
  pro: {
    description:"Scale up your operations with additional features and more credits.",
  },
  ultra: {
    description:"Unleash the full potential of your business with advanced features and a large number of credits.",
  },
};
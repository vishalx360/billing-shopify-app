import { GraphqlQueryError, BillingInterval } from '@shopify/shopify-api';
import shopify from '../config/shopify.js';
import { billingConfig } from '../config/billing.js';

const USAGE_CHARGE_INCREMENT_AMOUNT = 1.0;


export async function requestBilling(res, next) {
  const plans = Object.keys(billingConfig);
  const session = res.locals.shopify.session;

  const hasPayment = await shopify.api.billing.check({
    session,
    plans: plans,
    isTest: true,
  });

  if (hasPayment) {
    next();
  } else {
    res.redirect(
      await shopify.api.billing.request({
        session,
        plan: plans[0],
        isTest: true,
      })
    );
  }
}

const CREATE_USAGE_RECORD = `
mutation appUsageRecordCreate($subscriptionLineItemId: ID!, $amount: Decimal!, $description: String!){
    appUsageRecordCreate(
      subscriptionLineItemId: $subscriptionLineItemId,
      description: $description,
      price: { amount: $amount, currencyCode: USD }
    ) {
      userErrors {
        field
        message
      }
      appUsageRecord {
        id
      }
    }
  }
`;

const HAS_PAYMENTS_QUERY = `
query appSubscription {
  currentAppInstallation {
    activeSubscriptions {
          id 
          name
          lineItems {
                id
                plan {
                  pricingDetails {
                    __typename
                    ... on AppUsagePricing {
                      terms
                      balanceUsed {
                        amount
                      }
                      cappedAmount {
                        amount
                      }
                    }
                  }
                }
              }
          }
        }
    }
`;

const APP_SUBSCRIPTION_ID_QUERY = `
query { 
  currentAppInstallation {
    activeSubscriptions {
      id
    }
  }
}
`;

const USAGE_RECORDS_QUERY = `
query($subscriptionId: ID!) {
  node(id: $subscriptionId) {
    ...on AppSubscription {
      lineItems {
        usageRecords(first: 5) {
          edges {
            node {
              id
              description
              createdAt
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

export async function getMyUsageRecords(session) {
  const client = new shopify.api.clients.Graphql({ session });
  const subscriptionId = await getAppSubscriptionId(session);

  if (!subscriptionId) {
    return [];
  }
  try {
    const response = await client.query({
      data: {
        query: USAGE_RECORDS_QUERY,
        variables: {
          subscriptionId: subscriptionId,
        },
      },
    });

    const usageRecords =
      response?.body?.data?.node?.lineItems[0]?.usageRecords?.edges?.map(
        (edge) => {
          return { ...edge.node };
        }
      );
    return usageRecords ? usageRecords : [];
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}

/*
 * This function creates a usage record for the app subscription.
 * To create a usage record, we need to know the app subscription line item ID.
 * You may want to store this ID in your database, but for simplicity, we are
 * querying the API for it here.
 */
export async function createUsageRecord(session) {
  const client = new shopify.api.clients.Graphql({ session });
  const subscriptionLineItem = await getAppSubscription(session);
  console.log({ subscriptionLineItem });
  const plan = Object.keys(billingConfig)[0];
  const res = {
    capacityReached: false,
    createdRecord: false,
  };

  // If the capacity has already been reached, we will not attempt to create the usage record
  // On production shops, if you attempt to create a usage record and the capacity and been
  // reached Shopify will return an error. On development shops, the usage record will be created
  if (
    subscriptionLineItem.balanceUsed + USAGE_CHARGE_INCREMENT_AMOUNT >
    subscriptionLineItem.cappedAmount
  ) {
    res.capacityReached = true;
    return res;
  }

  try {
    // This makes an API call to Shopify to create a usage record
    await client.query({
      data: {
        query: CREATE_USAGE_RECORD,
        variables: {
          subscriptionLineItemId: subscriptionLineItem.id,
          amount: USAGE_CHARGE_INCREMENT_AMOUNT,
          description: billingConfig[plan].usageTerms,
        },
      },
    });
    res.createdRecord = true;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }

  if (
    subscriptionLineItem.balanceUsed + USAGE_CHARGE_INCREMENT_AMOUNT >=
    subscriptionLineItem.cappedAmount
  ) {
    res.capacityReached = true;
  }
  return res;
}

/*
 * This function queries the API to get the app subscription ID.
 * You may want to store this ID in your database, but for simplicity, we are
 * querying the API for it here.
 */
export async function getAppSubscriptionId(session) {
  const client = new shopify.api.clients.Graphql({ session });
  let subscriptionId = null;
  try {
    const response = await client.query({
      data: {
        query: APP_SUBSCRIPTION_ID_QUERY,
      },
    });
    subscriptionId =
      response?.body?.data?.currentAppInstallation?.activeSubscriptions[0]?.id;
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
  return subscriptionId;
}
/*
 * This function queries the API to get the app subscription line item ID by the
 * plan name and usage terms. You may want to store this ID in your database, but
 * for simplicity, we are querying the API for it here.
 */
export async function getAppSubscription(session) {
  const client = new shopify.api.clients.Graphql({ session });
  let subscriptionLineItem = {};
  const planName = Object.keys(billingConfig)[0];
  const planDescription = billingConfig[planName].usageTerms;

  try {
    const response = await client.query({
      data: {
        query: HAS_PAYMENTS_QUERY,
      },
    });
    response.body.data.currentAppInstallation.activeSubscriptions.forEach(
      (subscription) => {
        if (subscription.name === planName) {
          subscription.lineItems.forEach((lineItem) => {
            if (lineItem.plan.pricingDetails.terms === planDescription) {
              subscriptionLineItem = {
                id: lineItem.id,
                balanceUsed: parseFloat(
                  lineItem.plan.pricingDetails.balanceUsed.amount
                ),
                cappedAmount: parseFloat(
                  lineItem.plan.pricingDetails.cappedAmount.amount
                ),
                terms: lineItem.plan.pricingDetails.terms,
              };
            }
          });
        }
      }
    );
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
  return subscriptionLineItem;
}

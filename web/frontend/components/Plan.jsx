import {
  EmptyState,
  Card,
  Grid,
  TextStyle,
  DisplayText,
} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { useNavigate } from "@shopify/app-bridge-react";

import { basic, pro, ultra } from "../assets/index";

const imageMap = {
  basic: basic,
  pro: pro,
  ultra: ultra,
};

export default function Plan({ plan }) {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = useCallback(() => {
    setIsLoading(true);
    // Redirect to purchase plan route
    fetch("/api/credits/purchase/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId: plan._id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate(data.invoiceUrl);
      })
      .catch((error) => {
        console.error("Error purchasing plan:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetch, navigate, plan._id]);

  return (
    <Grid.Cell>
      <Card sectioned>
        <EmptyState
          heading={plan.credits + " Credits"}
          action={{
            loading: isLoading,
            content: `Buy ${plan.credits} credits`,
            onAction: () => handlePurchase(plan.id),
          }}
          image={imageMap[plan.plan] || ""}
          imageContained
        >
          <DisplayText size="small">
            <TextStyle variation="strong">Rs. {plan.price}</TextStyle>
          </DisplayText>
          <p>{plan.description}</p>
        </EmptyState>
      </Card>
    </Grid.Cell>
  );
}

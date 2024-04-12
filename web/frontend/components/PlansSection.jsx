import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import Plan from "./Plan";
import { EmptyState, Card, Grid, Page } from "@shopify/polaris";

function PlansSection() {
  const fetch = useAuthenticatedFetch();
  const [plans, setPlans] = useState([]);
  
  useEffect(() => {
    // Fetch available plans
    fetch("/api/credits/plans")
      .then((response) => response.json())
      .then((data) => {
        setPlans(data.plans);
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
      });
  }, []);
  return (
    <Page title="Available Plans">
      <Grid columns={{ xs: 1, sm: 3, md: 3, lg: 3, xl: 3 }}>
        {plans.map((plan) => (
          <Plan key={plan._id} plan={plan} />
        ))}
      </Grid>
    </Page>
  );
}

export default PlansSection;

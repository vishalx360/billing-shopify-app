import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { Card, Page, TextStyle, DisplayText } from "@shopify/polaris";
function BalanceSection() {
  const fetch = useAuthenticatedFetch();
  const [balanceData, setBalanceData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    // Fetch user's balance
    fetch("/api/credits/balance")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBalanceData(data);
        setIsLoading(false); // Set isLoading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
        setIsLoading(false); // Set isLoading to false in case of error
      });
  }, []);

  return (
    <Page title="Balance">
      <Card sectioned>
        <DisplayText size="small">
        Current Balance: {" "}
            <TextStyle variation={isLoading ? "subdued" : balanceData.balance > 0 ? "positive" : "negative"}>
              {isLoading ? "Loading..." : balanceData.balance}
            </TextStyle>
        </DisplayText>
      </Card>
    </Page>
  );
}

export default BalanceSection;

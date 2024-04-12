import { Page, Card, DataTable } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';


export function PurchasesTable() {
  const [purchases, setPurchases] = useState([]);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
     // Fetch user's purchases
     fetch("/api/credits/purchases")
     .then((response) => response.json())
     .then((data) => {
       setPurchases(data.purchases);
     })
     .catch((error) => {
       console.error("Error fetching purchases:", error);
     });
  }, []);
  
  const rows = purchases.map((purchase) => {
    const formattedDate = new Date(purchase.createdAt).toISOString().split('T')[0];
    return [
      purchase.credits,
      formattedDate,
      "Rs."+purchase.amount,
      purchase.plan,
      purchase.invoiceId,
      purchase.webhookId,
    ];
  });

  return (
    <Page title="Past Purchases">
      <Card>
        <DataTable
          columnContentTypes={[ 'numeric', 'text', 'numeric',  'text', 'text', 'text']}
          headings={[ 'Credits', 'Date', 'Amount',  'Plan',  'Invoice ID', 'Webhook ID', ]}
          rows={rows}
          footerContent={purchases.length > 0 ? null : 'No purchases'}
        />
      </Card>
    </Page>
  );
}

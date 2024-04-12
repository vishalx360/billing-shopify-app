import { Page, Card, DataTable } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks';

export function ActivePurchasesTable() {
  const [activePurchases, setActivePurchases] = useState([]);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
     // Fetch user's purchases
     fetch("/api/credits/activePurchases")
     .then((response) => response.json())
     .then((data) => {
       setActivePurchases(data.activePurchases.oneTimePurchases);
     })
     .catch((error) => {
       console.error("Error fetching purchases:", error);
     });
  }, []);
  console.log(activePurchases);
  const rows = activePurchases.map((purchase) => {
    return [
      purchase.name + (purchase.test ? ' (Test)' : ''),
      purchase.status,
      purchase.id,
    ];
  });

  return (
    <Page title="Active Purchases">
      <Card>
        <DataTable
          columnContentTypes={['text', 'text', "text"]}
          headings={['Name', 'Status', "Invoice ID"]}
          rows={rows}
          footerContent={activePurchases.length > 0 ? null : 'No active purchases'}
        />
      </Card>
    </Page>
  );
}

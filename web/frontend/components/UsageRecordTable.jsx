import { Page, Card, DataTable } from '@shopify/polaris';
import React from 'react';

export function UsageRecordTable({ usageRecords = [] }) {
  const rows = usageRecords.map((record) => {
    const formattedDate =
      new Date(record.createdAt).toLocaleDateString() +
      ' ' +
      new Date(record.createdAt).toLocaleTimeString();
    return [record.price.amount, record.id.split('/').pop(), formattedDate];
  });

  return (
    <Page title="Last 5 Usage Records">
      <Card>
        <DataTable
          columnContentTypes={['text', 'text', 'text']}
          headings={['Amount', 'ID', 'Date']}
          rows={rows}
          footerContent={usageRecords.length > 0 ? null : 'No usage records'}
          //   totals={['', '', '', 255, '$155,830.00']}
        />
      </Card>
    </Page>
  );
}

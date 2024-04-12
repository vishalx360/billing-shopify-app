import { useEffect, useState } from 'react';
import { Card, Badge } from '@shopify/polaris';
import { Toast, useNavigate } from '@shopify/app-bridge-react';

import { useAuthenticatedFetch } from '../hooks';
import { UsageRecordTable } from './UsageRecordTable';

export function UsageCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState({ content: null });
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const capacityReached =
    data?.subscription?.balanceUsed >= data?.subscription?.cappedAmount;

  // useEffect(() => {
  //   handleGetUsageRecord();
  // }, []);
  const handleGetUsageRecord = async () => {
    setIsLoading(true);
    const response = await fetch('/api/subscription');
    const body = await response.json();

    console.log({ body });
    setData(body);

    if (response.ok) {
      setToastProps({ content: 'Usage record fetched!' });
    } else {
      setToastProps({
        content: 'There was an error creating usage record',
        error: true,
      });
    }
    setIsLoading(false);
  };

  /*
   * This uses AppBridge to open the  app subscription management page
   * in the Shopify Admin.
   */
  const handleNavigateToSubscriptionPage = () => {
    navigate('/settings/billing/subscriptions', {
      replace: true,
      target: 'host',
    });
  };

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps({ content: null })} />
  );

  return (
    <Card>
      {toastMarkup}
      <Card>
        <Card.Section>
          <h1>Usage</h1>
          <h1>
            {data?.subscription?.balanceUsed} /{' '}
            {data?.subscription?.cappedAmount}
          </h1>
          <Badge status={capacityReached ? 'critical' : 'success'}>
            {capacityReached ? 'Capacity Reached' : 'Capacity Available'}
          </Badge>
        </Card.Section>
        <Card.Section>
          <button onClick={handleGetUsageRecord} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Usage Record'}
          </button>
          <button onClick={handleNavigateToSubscriptionPage}>
            Manage Subscription
          </button>
        </Card.Section>
      </Card>
      <UsageRecordTable usageRecords={data.usageRecords} />
    </Card>
  );
}




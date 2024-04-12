import {
  Page,
  Layout,
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';


import { ProductsCard, PaidFeature } from '../components';
import { UsageCard } from '../components/UsageCard';
import CreditsPage from '../components/CreditsPage';

export default function HomePage() {
  return (
    <Page >
      <TitleBar title="App name" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <CreditsPage/>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

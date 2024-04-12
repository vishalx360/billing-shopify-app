import { PurchasesTable } from "./PurchasesTable";
import PlansSection from "./PlansSection";
import BalanceSection from "./BalanceSection";
import { ActivePurchasesTable } from "./ActivePurchasesTable";

const CreditsPage = () => {
  return (
    <div style={{paddingBottom:"20px"}}>
      <BalanceSection />
      <PlansSection />
      <PurchasesTable />
      <ActivePurchasesTable />
    </div>
  );
};

export default CreditsPage;

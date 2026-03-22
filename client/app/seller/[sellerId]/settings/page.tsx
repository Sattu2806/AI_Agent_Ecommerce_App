import { SellerDashboardGuard } from "@/components/seller/seller-dashboard-guard";
import { SellerSettingsContent } from "./seller-settings-content";

type PageProps = {
  params: Promise<{ sellerId: string }>;
};

export default async function SellerSettingsPage({ params }: PageProps) {
  const { sellerId } = await params;
  return (
    <SellerDashboardGuard sellerId={sellerId}>
      <SellerSettingsContent sellerId={sellerId} />
    </SellerDashboardGuard>
  );
}

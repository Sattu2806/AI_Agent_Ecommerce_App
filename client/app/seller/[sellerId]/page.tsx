import { SellerDashboardGuard } from "@/components/seller/seller-dashboard-guard";
import { SellerDashboardContent } from "@/components/seller/seller-dashboard-content";

type PageProps = {
  params: Promise<{ sellerId: string }>;
};

export default async function SellerDashboardPage({ params }: PageProps) {
  const { sellerId } = await params;

  return (
    <SellerDashboardGuard sellerId={sellerId}>
      <SellerDashboardContent sellerId={sellerId} />
    </SellerDashboardGuard>
  );
}

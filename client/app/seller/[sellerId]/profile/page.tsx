import { SellerDashboardGuard } from "@/components/seller/seller-dashboard-guard";
import { SellerProfileContent } from "./seller-profile-content";

type PageProps = {
  params: Promise<{ sellerId: string }>;
};

export default async function SellerProfilePage({ params }: PageProps) {
  const { sellerId } = await params;
  return (
    <SellerDashboardGuard sellerId={sellerId}>
      <SellerProfileContent sellerId={sellerId} />
    </SellerDashboardGuard>
  );
}

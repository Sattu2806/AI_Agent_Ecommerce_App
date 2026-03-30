import { SellerDashboardGuard } from "@/components/seller/seller-dashboard-guard";
import { AddProductContent } from "./add-product-content";

type PageProps = {
  params: Promise<{ sellerId: string }>;
};

export default async function AddProductPage({ params }: PageProps) {
  const { sellerId } = await params;

  return (
    <SellerDashboardGuard sellerId={sellerId}>
      <AddProductContent sellerId={sellerId} />
    </SellerDashboardGuard>
  );
}

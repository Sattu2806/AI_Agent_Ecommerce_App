import { SellerDashboardGuard } from "@/components/seller/seller-dashboard-guard";
import { EditProductContent } from "./edit-product-content";

type PageProps = {
  params: Promise<{ sellerId: string; productId: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { sellerId, productId } = await params;

  return (
    <SellerDashboardGuard sellerId={sellerId}>
      <EditProductContent sellerId={sellerId} productId={productId} />
    </SellerDashboardGuard>
  );
}

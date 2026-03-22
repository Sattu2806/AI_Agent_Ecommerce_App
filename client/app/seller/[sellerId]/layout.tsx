import type { Metadata } from "next";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ sellerId: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { sellerId } = await params;
  return {
    title: `Seller Dashboard — ${sellerId}`,
    description: "Seller dashboard for your store",
  };
}

export default function SellerDashboardLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

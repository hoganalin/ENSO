import CheckoutSuccess from "../../../../components/CheckoutSuccess";

// CheckoutSuccess 讀 useSearchParams()，走 dynamic 讓 Next.js 不嘗試靜態產出
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessWithIdPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<JSX.Element> {
  const { orderId } = await params;
  return <CheckoutSuccess orderId={orderId} />;
}

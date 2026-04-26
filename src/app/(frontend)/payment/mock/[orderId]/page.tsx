import PaymentMock from "../../../../../components/PaymentMock";

// PaymentMock 讀 useSearchParams()，走 dynamic 讓 Next.js 不嘗試靜態產出
export const dynamic = "force-dynamic";

export default async function PaymentMockPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<JSX.Element> {
  const { orderId } = await params;
  return <PaymentMock orderId={orderId} />;
}

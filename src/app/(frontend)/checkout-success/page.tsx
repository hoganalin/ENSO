import CheckoutSuccess from "../../../components/CheckoutSuccess";

// CheckoutSuccess 使用 useSearchParams 讀綠界模擬頁塞過來的 method/tno/ectno，
// 因此這條 route 無法靜態預先生成；加上 force-dynamic 明示走 SSR。
export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage(): JSX.Element {
  return <CheckoutSuccess />;
}


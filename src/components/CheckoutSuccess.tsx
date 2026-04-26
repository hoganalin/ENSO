"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPaymentMethod } from "../constants/paymentMethods";

interface CheckoutSuccessProps {
  orderId?: string;
}

function CheckoutSuccess({ orderId }: CheckoutSuccessProps): JSX.Element {
  const searchParams = useSearchParams();
  // 使用 useState 確保重新渲染時訂單編號不會變動且避免 impurity 錯誤
  const [orderNumber] = useState(
    () => orderId || "ENSO" + Math.floor(Math.random() * 10000000),
  );
  // 從 payment/mock 跳回來時會帶這三個參數；直接刷頁或從其他入口進來時可能沒有
  const paidMethodId = searchParams.get("method") ?? "";
  const merchantTradeNo = searchParams.get("tno") ?? "";
  const ecpayTradeNo = searchParams.get("ectno") ?? "";
  const paymentMethod = getPaymentMethod(paidMethodId);

  return (
    <div className="checkout-success-page py-5 bg-custom-light">
      <div className="max-w-[1180px] mx-auto py-5">
        {/* 結帳進度條 */}
        <div className="checkout-progress mb-5 md:px-10">
          <div className="step completed">
            <span className="step-num">1</span>
            <span className="step-text">確認購物車</span>
          </div>
          <div className="step-line active"></div>
          <div className="step completed">
            <span className="step-num">2</span>
            <span className="step-text">填寫資料</span>
          </div>
          <div className="step-line active"></div>
          <div className="step active">
            <span className="step-num">3</span>
            <span className="step-text">訂單完成</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full md:max-w-xl">
            <div className="bg-white border-0 shadow-sm p-10 text-center rounded-2xl">
              <div className="success-icon-wrapper mb-4">
                <i className="bi bi-check-circle-fill text-green-500 text-[5rem]"></i>
              </div>
              <h2 className="font-bold mb-3">訂單已成功提交</h2>
              <p className="text-gray-500 mb-4 md:px-10">
                感謝您的訂購！我們已收到您的訂單，正在為您準備精心挑選的香氣產品。
              </p>

              <div className="order-info-box bg-enso-cream p-3 rounded-xl mb-5">
                <p className="mb-1 text-gray-500 text-sm">訂單編號</p>
                <h4 className="font-bold text-enso-gold">{orderNumber}</h4>
              </div>

              {paymentMethod && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl mb-5 text-left text-sm">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                    <i className="bi bi-shield-check"></i>
                    綠界 ECPay 交易完成
                  </div>
                  <div className="flex justify-between text-gray-600 py-0.5">
                    <span>付款方式</span>
                    <span className="font-medium text-gray-800">
                      <i className={`bi ${paymentMethod.icon} mr-1`}></i>
                      {paymentMethod.label}
                    </span>
                  </div>
                  {merchantTradeNo && (
                    <div className="flex justify-between gap-2 text-gray-600 py-0.5">
                      <span className="flex-shrink-0">商店交易編號</span>
                      <span className="font-mono text-gray-800 break-all text-right">
                        {merchantTradeNo}
                      </span>
                    </div>
                  )}
                  {ecpayTradeNo && (
                    <div className="flex justify-between gap-2 text-gray-600 py-0.5">
                      <span className="flex-shrink-0">綠界交易編號</span>
                      <span className="font-mono text-gray-800 break-all text-right">
                        {ecpayTradeNo}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center">
                <Link
                  href="/"
                  className="inline-block px-5 py-2 rounded-lg border border-gray-800 text-gray-800 font-medium transition-all duration-200 hover:bg-gray-800 hover:text-white hover:shadow-md"
                >
                  返回首頁
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;
        
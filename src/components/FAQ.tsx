"use client";

import { useState } from "react";
const FAQ = (): JSX.Element => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  interface FAQItem {
    question: string;
    answer: string;
  }
  const faqData: FAQItem[] = [
    {
      question: "線香的保存期限有多長？",
      answer:
        "ENSO 線香使用天然原料製作，放置於陰涼乾燥處可保存約 3-5 年。建議避免陽光直射與過度潮濕，以維持香氣的最佳狀態。",
    },
    {
      question: "線香點燃後煙霧很大嗎？",
      answer:
        "我們的產品採用專利低煙配方，相較於傳統線香，煙霧量極低，非常適合在現代室內空間、辦公室或公寓中使用，不顯嗆鼻。",
    },
    {
      question: "家中有小孩或寵物可以使用嗎？",
      answer:
        "可以。但建議在通風良好的環境下使用，並將線香置於兒童及寵物無法觸及的高度。若寵物有呼吸道敏感問題，建議先短時間試用觀測。",
    },
    {
      question: "每支線香可以燃燒多久？",
      answer:
        "標準長度線香約可燃燒 40-50 分鐘，具體時間會因空間通風程度而略有差異。",
    },
    {
      question: "如何處理燃燒後的香灰？",
      answer:
        "等待香灰冷卻後，可直接倒入垃圾袋中處理。部分的香灰也可以作為盆栽的天然肥料使用。",
    },
  ];

  return (
    <div className="faq-page max-w-[1180px] mx-auto px-4 py-12 my-12">
      <div className="flex justify-center">
        <div className="w-full lg:max-w-2xl">
          <div className="text-center mb-5">
            <h2 className="font-bold mb-3">常見問題 FAQ</h2>
            <div className="w-10 h-0.5 bg-enso-gold mx-auto"></div>
          </div>

          <div className="shadow-sm rounded-2xl overflow-hidden">
            {faqData.map((item, index) => (
              <div
                className="border-b border-gray-200 last:border-0"
                key={index}
              >
                <button
                  className="w-full text-left font-bold py-4 px-5 flex justify-between items-center hover:bg-gray-50 transition"
                  type="button"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  aria-expanded={openIndex === index}
                >
                  {item.question}
                  <i
                    className={`fas fa-chevron-down transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
                {openIndex === index && (
                  <div className="py-4 px-5 text-gray-500 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

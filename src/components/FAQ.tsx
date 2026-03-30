const FAQ = (): JSX.Element => {
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
    <div className="faq-page container py-5 my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">常見問題 FAQ</h2>
            <div
              className="mx-auto"
              style={{
                width: "40px",
                height: "2px",
                backgroundColor: "#c7a15a",
              }}
            ></div>
          </div>

          <div
            className="accordion border-0 shadow-sm rounded-4 overflow-hidden"
            id="faqAccordion"
          >
            {faqData.map((item, index) => (
              <div
                className="accordion-item border-0 border-bottom"
                key={index}
              >
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-bold py-4"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    {item.question}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body py-4 text-secondary leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

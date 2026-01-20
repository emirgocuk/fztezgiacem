import React, { useState } from 'react';

const faqs = [
    {
        question: "Duyu bütünleme terapisi nedir?",
        answer: "Duyu bütünleme terapisi, beynin duyusal bilgileri (dokunma, hareket, denge vb.) nasıl işlediğini ve organize ettiğini ele alan, çocuğun günlük yaşam becerilerini ve öğrenme kapasitesini artırmayı hedefleyen bir terapi yöntemidir."
    },
    {
        question: "Çocuğumun evde desteklenmesi için neler yapabilirim?",
        answer: "Terapistinizle işbirliği içinde, çocuğunuzun duyusal ihtiyaçlarına uygun, ev ortamında uygulanabilecek oyun ve aktiviteler planlanır. Günlük rutinlere entegre edilen basit düzenlemelerle gelişim süreci desteklenir."
    },
    {
        question: "Değerlendirme süreci nasıl işliyor?",
        answer: "İlk görüşmede detaylı bir gelişim öyküsü alınır, ardından standart testler ve klinik gözlemlerle çocuğun duyusal profili çıkarılır. Bu değerlendirme sonucunda kişiye özel bir terapi planı oluşturulur."
    },
    {
        question: "Seanslar ne kadar sürüyor ve ne sıklıkla yapılmalı?",
        answer: "Seanslar genellikle 45-50 dakika sürer. Sıklık, çocuğun ihtiyaçlarına ve değerlendirme sonuçlarına göre belirlenir, ancak genellikle haftada 1 veya 2 seans önerilir."
    },
    {
        question: "Hangi yaş gruplarıyla çalışıyorsunuz?",
        answer: "Duyu bütünleme terapisi her yaş grubunda uygulanabilir, ancak erken müdahale (0-6 yaş) sonuçların en hızlı alındığı dönemdir. Bebeklerden ergenlik dönemine kadar tüm çocuklarla çalışmaktayız."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === index
                                ? 'bg-orange-50/50 border-orange-200 shadow-md'
                                : 'bg-white border-gray-100 hover:border-orange-100'
                            }`}
                    >
                        <button
                            className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                            onClick={() => toggleFAQ(index)}
                        >
                            <span className={`font-semibold text-lg ${openIndex === index ? 'text-orange-600' : 'text-slate-700'}`}>
                                {faq.question}
                            </span>
                            <span className={`transform transition-transform duration-300 ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${openIndex === index ? 'rotate-180 bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </span>
                        </button>
                        <div
                            className={`transition-[max-height,opacity] duration-300 ease-in-out px-5 text-slate-600 leading-relaxed overflow-hidden ${openIndex === index ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0'
                                }`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;

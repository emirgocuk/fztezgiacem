import React, { useState } from 'react';
import LeadCaptureForm from './LeadCaptureForm';

const questions = [
    {
        id: 1,
        question: "Çocuğunuz yüksek seslerden veya beklenmedik gürültülerden aşırı rahatsız oluyor mu?",
        options: [
            { text: "Evet, sık sık elleriyle kulaklarını kapatıyor.", score: 3 },
            { text: "Bazen, sadece çok yüksek seslerde.", score: 2 },
            { text: "Hayır, seslere normal tepki veriyor.", score: 0 }
        ]
    },
    {
        id: 2,
        question: "Çocuğunuzun kıyafet etiketlerinden, belirli kumaşlardan veya çorap dikişlerinden rahatsız olduğunu gözlemliyor musunuz?",
        options: [
            { text: "Evet, her sabah giyinmek bir mücadele.", score: 3 },
            { text: "Bazen, belirli kıyafetleri giymek istemiyor.", score: 1 },
            { text: "Hayır, kıyafetlerle ilgili bir sorunu yok.", score: 0 }
        ]
    },
    {
        id: 3,
        question: "Çocuğunuz sürekli hareket halinde mi? Yerinde durmakta zorlanıyor mu?",
        options: [
            { text: "Evet, sanki motor takılmış gibi durmuyor.", score: 3 },
            { text: "Bazen hareketli ama gerektiğinde oturabiliyor.", score: 1 },
            { text: "Hayır, genel olarak sakin.", score: 0 }
        ]
    },
    {
        id: 4,
        question: "Denge kurmakta veya bisiklet sürmek, top yakalamak gibi becerilerde yaşıtlarından geride mi?",
        options: [
            { text: "Evet, sakarlık ve koordinasyon sorunu var.", score: 3 },
            { text: "Biraz zorlanıyor ama deniyor.", score: 1 },
            { text: "Hayır, fiziksel becerileri yaşıtlarıyla uyumlu.", score: 0 }
        ]
    },
    {
        id: 5,
        question: "Yemek seçiyor mu? Sadece belirli dokudaki veya tattaki yiyecekleri mi yiyeiyor?",
        options: [
            { text: "Evet, yemek zamanı çok zorlu geçiyor.", score: 3 },
            { text: "Biraz seçici ama çeşitlilik var.", score: 1 },
            { text: "Hayır, genel olarak her şeyi yer.", score: 0 }
        ]
    },
    {
        id: 6,
        question: "Çocuğunuzun uyku düzeni nasıl?",
        options: [
            { text: "Uykuya dalmakta ve sürdürmekte çok zorlanıyor.", score: 2 },
            { text: "Bazen uyanıyor ama geri uyuyabiliyor.", score: 1 },
            { text: "Düzenli bir uykusu var.", score: 0 }
        ]
    }
];

export default function QuizApp() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [showEmailGate, setShowEmailGate] = useState(false);
    const [showResult, setShowResult] = useState(false);

    // Store answers just in case, but for wizard simple accumulation is enough.
    // Actually simpler to just track score for now or we can track answers if we want to go back.
    // Let's keep it simple: One way flow.

    const handleAnswer = (score) => {
        const nextScore = totalScore + score;
        setTotalScore(nextScore);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowEmailGate(true);
        }
    };

    const handleEmailSubmitted = () => {
        // Redirect to new result page with score
        window.location.href = `/quiz-sonuc?score=${totalScore}`;
    };

    // Removed inline result display logic as requested by user.
    // Results are now shown on a separate page (/quiz-sonuc).

    if (showEmailGate) {
        return (
            <div className="max-w-xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Sonuca Çok Az Kaldı!</h2>
                    <p className="text-slate-600 text-lg">Test sonucunuzu ve size özel önerileri görmek için lütfen aşağıdan devam edin.</p>
                </div>

                <LeadCaptureForm
                    source="quiz_result"
                    title=""
                    buttonText="Sonucumu Göster"
                    successMessage="Harika! Sonucunuz hazırlanıyor..."
                    onSuccess={handleEmailSubmitted}
                    className="shadow-none border-0 p-0"
                />

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button
                        onClick={handleEmailSubmitted}
                        className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                    >
                        Şimdilik e-posta girmeden devam et
                    </button>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-12 overflow-hidden">
                <div
                    className="bg-[#FF8A65] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                ></div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-white/50 backdrop-blur-sm relative h-[450px] flex items-stretch transition-all duration-500 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-stretch w-full h-full">
                    {/* Left: Question Header & Text */}
                    <div className="md:w-5/12 flex flex-col justify-start border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6 pt-2 shrink-0">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4 w-fit">
                            Soru {currentQuestion + 1} / {questions.length}
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                            {question.question}
                        </h2>
                    </div>

                    {/* Right: Options */}
                    <div className="md:w-7/12 flex flex-col justify-center space-y-3 overflow-y-auto custom-scrollbar pr-2">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt.score)}
                                className="w-full text-left p-4 rounded-xl border-2 border-slate-50 hover:border-[#FF8A65] hover:bg-orange-50 group transition-all duration-200 flex items-center justify-between shrink-0"
                            >
                                <span className="font-medium text-base md:text-lg text-slate-600 group-hover:text-slate-900">{opt.text}</span>
                                <span className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-slate-300 group-hover:border-[#FF8A65] group-hover:bg-[#FF8A65] flex-shrink-0 ml-4 transition-colors"></span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Back Button / Controls could go here if needed */}
            <div className="text-center mt-8">
                <p className="text-slate-400 text-sm">
                    Geri dönülemez, lütfen en uygun seçeneği işaretleyin.
                </p>
            </div>
        </div>
    );
}

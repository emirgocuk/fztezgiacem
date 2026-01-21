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
    const [answers, setAnswers] = useState({});
    const [showEmailGate, setShowEmailGate] = useState(false);

    const handleAnswer = (score) => {
        // Save answer for current question
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: score
        }));

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowEmailGate(true);
        }
    };

    const handleBack = () => {
        if (showEmailGate) {
            setShowEmailGate(false);
            return;
        }

        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleEmailSubmitted = () => {
        // Calculate total score from answers object
        const finalScore = Object.values(answers).reduce((a, b) => a + b, 0);
        window.location.href = `/quiz-sonuc?score=${finalScore}`;
    };

    const question = questions[currentQuestion];

    // Calculate progress width
    const progressWidth = showEmailGate
        ? '100%'
        : `${((currentQuestion) / questions.length) * 100}%`;

    const showBackButton = currentQuestion > 0 || showEmailGate;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Progress Bar - Always valid to preserve layout height */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-6 md:mb-12 mt-6 overflow-hidden">
                <div
                    className="bg-[#FF8A65] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: progressWidth }}
                ></div>
            </div>

            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-white/50 backdrop-blur-sm relative h-[72vh] md:h-[510px] flex items-stretch transition-all duration-500 overflow-hidden">
                {showEmailGate ? (
                    <div className="w-full h-full flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
                        {/* Back Button for Email Gate */}
                        <div className="absolute top-0 left-0">
                            <button
                                onClick={handleBack}
                                className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                                aria-label="Önceki soruya dön"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5" />
                                    <path d="M12 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center pt-8 md:pt-0">
                            <div className="max-w-xl w-full text-center">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Sonuca Çok Az Kaldı!</h2>
                                    <p className="text-slate-600">Test sonucunuzu ve size özel önerileri görmek için lütfen aşağıdan devam edin.</p>
                                </div>

                                <LeadCaptureForm
                                    source="quiz_result"
                                    title=""
                                    buttonText="Sonucumu Göster"
                                    successMessage="Harika! Sonucunuz hazırlanıyor..."
                                    onSuccess={handleEmailSubmitted}
                                    className="shadow-none border-0 p-0 bg-transparent"
                                    buttonClassName="w-full bg-[#FF8A65] hover:bg-[#FF7043] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-200 mt-4"
                                />

                                <div className="mt-6">
                                    <button
                                        onClick={handleEmailSubmitted}
                                        className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                                    >
                                        Şimdilik e-posta girmeden devam et
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-stretch w-full h-full animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Left: Question Header & Text */}
                        <div className="md:w-5/12 flex flex-col justify-start border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6 pt-2 shrink-0 relative">
                            {/* Back Button */}
                            <div className={`transition-opacity duration-300 mb-2 ${showBackButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                <button
                                    onClick={handleBack}
                                    className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5" />
                                        <path d="M12 19l-7-7 7-7" />
                                    </svg>
                                    Geri
                                </button>
                            </div>

                            <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4 w-fit">
                                Soru {currentQuestion + 1} / {questions.length}
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                                {question.question}
                            </h2>
                        </div>

                        {/* Right: Options */}
                        <div className="md:w-7/12 flex flex-col h-full gap-4 overflow-y-auto custom-scrollbar pr-2 py-2">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt.score)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex flex-1 items-center justify-between shrink-0 group 
                                        ${answers[currentQuestion] === opt.score
                                            ? 'border-[#FF8A65] bg-orange-50'
                                            : 'border-slate-50 hover:border-[#FF8A65] hover:bg-orange-50'
                                        }`}
                                >
                                    <span className={`font-medium text-base md:text-lg group-hover:text-slate-900 ${answers[currentQuestion] === opt.score ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {opt.text}
                                    </span>
                                    <span className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex-shrink-0 ml-4 transition-colors
                                        ${answers[currentQuestion] === opt.score
                                            ? 'border-[#FF8A65] bg-[#FF8A65]'
                                            : 'border-slate-300 group-hover:border-[#FF8A65] group-hover:bg-[#FF8A65]'
                                        }`}>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty footer spacer to maintain consistent spacing if needed, but text is removed */}
        </div>
    );
}

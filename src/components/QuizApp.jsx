import React, { useState } from 'react';

const optionsTemplate = [
    { text: "Her Zaman", score: 1 },
    { text: "Sık Sık", score: 2 },
    { text: "Bazen", score: 3 },
    { text: "Nadiren", score: 4 },
    { text: "Hiçbir Zaman", score: 5 }
];

const categories = [
    { id: "dokunsal", title: "Dokunsal Hassasiyet" },
    { id: "tatKoku", title: "Tat/Koku Duyarlılığı" },
    { id: "hareket", title: "Hareket Hassasiyeti" },
    { id: "uyaran", title: "Uyaranlara Azalmış Hassasiyet / Duyusal Arayış" },
    { id: "isitsel", title: "İşitsel Filtreleme" },
    { id: "enerji", title: "Düşük Enerji/Güçsüzlük" },
    { id: "gorselIsitsel", title: "Görsel/İşitsel Hassasiyet" }
];

const allQuestions = [
    // 1. Dokunsal Hassasiyet
    { id: 1, category: "dokunsal", text: "Kendine bakım sırasında rahatsızlığını belirtir. (Örneğin saç kesimi sırasında, yüzünü yıkarken, tırnaklarını keserken)" },
    { id: 2, category: "dokunsal", text: "Soğuk havalarda kısa kollu sıcak havalarda uzun kollu kıyafetler tercih eder." },
    { id: 3, category: "dokunsal", text: "Çimende/kumda çıplak ayakla yürümekten kaçınır." },
    { id: 4, category: "dokunsal", text: "Dokunmaya karşı agresiftir, duygusal tepki gösterir." },
    { id: 5, category: "dokunsal", text: "Suya dalmaktan kaçınır." },
    { id: 6, category: "dokunsal", text: "Diğer insanlara yakın olmaktan, sırada beklemekten kaçınır." },
    { id: 7, category: "dokunsal", text: "Kendisine dokunulursa dokunulan bölgeyi ovalar kaşır." },
    // 2. Tat/Koku Duyarlılığı
    { id: 8, category: "tatKoku", text: "Tipik olarak diyetlerinin bir parçası olan keskin koku ve tatlardan uzak durur." },
    { id: 9, category: "tatKoku", text: "Sadece belirgin tatlardaki yiyecekleri yer." },
    { id: 10, category: "tatKoku", text: "Yiyeceklerde seçicidir." },
    { id: 11, category: "tatKoku", text: "Özellikle gıda dokuları ile ilgili seçicidir." },
    // 3. Hareket Hassasiyeti
    { id: 12, category: "hareket", text: "Ayakları yerden kesilince korkar, tedirgin olur." },
    { id: 13, category: "hareket", text: "Düşmekten veya yüksekte olmaktan korkar." },
    { id: 14, category: "hareket", text: "Baş pozisyonunun değiştiği aktivitelerden hoşlanmaz (örneğin takla atmak)" },
    // 4. Uyaranlara Azalmış Hassasiyet Duyusal Arayış
    { id: 15, category: "uyaran", text: "Garip seslerden hoşlanır, tuhaf sesler çıkarır." },
    { id: 16, category: "uyaran", text: "Günlük rutinleri karıştırır. (oturmaktan rahatsızdır ya da sürekli oturur.)" },
    { id: 17, category: "uyaran", text: "Hareketli aktivitelerde paniktir." },
    { id: 18, category: "uyaran", text: "Diğer insanlara ve objelere dokunabilir." },
    { id: 19, category: "uyaran", text: "Eli yüzü kirliyken rahatsız görünmez." },
    { id: 20, category: "uyaran", text: "Oyunun aşamalarını atlar, oyunu karıştırır." },
    { id: 21, category: "uyaran", text: "Vücudunu saran kıyafetlerden hoşlanmaz, rahatsız olur." },
    // 5. İşitsel Filtreleme
    { id: 22, category: "isitsel", text: "Etrafta çok fazla gürültü varsa işlevselliği bozulur. Sıkıntı yaşar, uzak durur." },
    { id: 23, category: "isitsel", text: "Karşısındakinin isteklerini duymuyormuş gibi görünür." },
    { id: 24, category: "isitsel", text: "Arka plandaki seslerle çalışamaz. (fan gibi)" },
    { id: 25, category: "isitsel", text: "Radyo açıkken görevlerini tamamlayamaz" },
    { id: 26, category: "isitsel", text: "Duyduğu halde ismine tepki vermez." },
    { id: 27, category: "isitsel", text: "Dikkatini toplamakta sıkıntı yaşar." },
    // 6. Düşük Enerji/Güçsüzlük
    { id: 28, category: "enerji", text: "Güçsüz kaslara sahip görünür." },
    { id: 29, category: "enerji", text: "Kendini desteklemekte zorlanır. Özellikle ayakta dururken ya da özel bir pozisyonda çabuk yorulur." },
    { id: 30, category: "enerji", text: "Kavrayışı güçsüzdür." },
    { id: 31, category: "enerji", text: "Ağır nesneleri kaldıramaz." },
    { id: 32, category: "enerji", text: "Kendini destekleyemez." },
    { id: 33, category: "enerji", text: "Duyarlılığı zayıf, kolay yorulur." },
    // 7. Görsel/İşitsel Hassasiyet
    { id: 34, category: "gorselIsitsel", text: "Beklenmeyen ya da yüksek seslere olumsuz tepki verir (örneğin elektrikli süpürge, saç kurutma makinası vb. seslerde ağlar ya da saklanır)" },
    { id: 35, category: "gorselIsitsel", text: "Seslerden korunmak için kulaklarını elleriyle kapatır" },
    { id: 36, category: "gorselIsitsel", text: "Başkalarının uyum sağlayabildiği parlak ışıklardan rahatsız olur" },
    { id: 37, category: "gorselIsitsel", text: "Odada hareket eden herkesi izler" },
    { id: 38, category: "gorselIsitsel", text: "Işıktan korunmak için elleriyle gözlerini kapatır ya da gözlerini kısar" }
];

export default function QuizApp() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleAnswer = (score) => {
        const newAnswers = {
            ...answers,
            [currentQuestion]: score
        };
        setAnswers(newAnswers);

        if (currentQuestion < allQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const finishQuiz = (finalAnswers) => {
        const categoryScores = {
            dokunsal: 0,
            tatKoku: 0,
            hareket: 0,
            uyaran: 0,
            isitsel: 0,
            enerji: 0,
            gorselIsitsel: 0
        };

        Object.keys(finalAnswers).forEach((questionIndex) => {
            const index = parseInt(questionIndex);
            const questionData = allQuestions[index];
            categoryScores[questionData.category] += finalAnswers[index];
        });

        const scoreParams = `d=${categoryScores.dokunsal}&t=${categoryScores.tatKoku}&h=${categoryScores.hareket}&u=${categoryScores.uyaran}&i=${categoryScores.isitsel}&e=${categoryScores.enerji}&g=${categoryScores.gorselIsitsel}`;

        window.location.href = `/quiz-sonuc?${scoreParams}`;
    };

    const question = allQuestions[currentQuestion];
    const categoryTitle = categories.find(c => c.id === question?.category)?.title;

    // Calculate progress width
    const progressWidth = `${((currentQuestion) / allQuestions.length) * 100}%`;

    const showBackButton = currentQuestion > 0;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-6 md:mb-12 mt-6 overflow-hidden">
                <div
                    className="bg-[#FF8A65] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: progressWidth }}
                ></div>
            </div>

            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-white/50 backdrop-blur-sm relative h-[78vh] md:h-[550px] flex items-stretch transition-all duration-500 overflow-hidden">
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

                            <div className="flex items-center gap-2 mb-4">
                                <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                                    Soru {currentQuestion + 1} / {allQuestions.length}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest bg-slate-50 py-1 px-3 rounded-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                    {categoryTitle}
                                </span>
                            </div>

                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                                {question.text}
                            </h2>
                        </div>

                        {/* Right: Options */}
                        <div className="md:w-7/12 flex flex-col h-full gap-3 overflow-y-auto custom-scrollbar pr-2 py-2">
                            {optionsTemplate.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt.score)}
                                    className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 flex flex-1 items-center justify-between shrink-0 group 
                                        ${answers[currentQuestion] === opt.score
                                            ? 'border-[#FF8A65] bg-orange-50'
                                            : 'border-slate-50 hover:border-[#FF8A65] hover:bg-orange-50'
                                        }`}
                                >
                                    <span className={`font-medium text-sm md:text-base group-hover:text-slate-900 ${answers[currentQuestion] === opt.score ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {opt.text}
                                    </span>
                                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-4 transition-colors
                                        ${answers[currentQuestion] === opt.score
                                            ? 'border-[#FF8A65] bg-[#FF8A65]'
                                            : 'border-slate-300 group-hover:border-[#FF8A65] group-hover:bg-[#FF8A65]'
                                        }`}>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import ResultContactForm from './ResultContactForm';

const categories = [
    { id: "d", name: "Dokunsal Hassasiyet", breaks: [27, 30] }, // [minProbable, minTypical]
    { id: "t", name: "Tat/Koku Duyarlılığı", breaks: [12, 15] },
    { id: "h", name: "Harekete Hassasiyet", breaks: [11, 13] },
    { id: "u", name: "Uyaranlara Azalmış Hassasiyet / Duyusal Arayış", breaks: [24, 27] },
    { id: "i", name: "İşitsel Filtreleme", breaks: [20, 23] },
    { id: "e", name: "Düşük Enerji/Güçsüzlük", breaks: [24, 26] },
    { id: "g", name: "Görsel/İşitsel Hassasiyet", breaks: [16, 19] }
];

const getResultLevel = (score, breaks) => {
    if (isNaN(score)) return null;
    if (score >= breaks[1]) {
        return {
            level: "Tipik Performans",
            desc: "Yaşıtlarıyla uyumlu",
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            icon: "✅"
        };
    } else if (score >= breaks[0]) {
        return {
            level: "Fark Görülebilir",
            desc: "Hafif hassasiyet",
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: "⚠️"
        };
    } else {
        return {
            level: "Kesin Farklı",
            desc: "Değerlendirme önerilir",
            color: "text-rose-700",
            bg: "bg-rose-50",
            border: "border-rose-200",
            icon: "🚨"
        };
    }
};

export default function QuizResult() {
    const [results, setResults] = useState([]);
    const [overallStatus, setOverallStatus] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        let validScores = 0;
        let definiteCount = 0;
        let probableCount = 0;

        const calculatedResults = categories.map(cat => {
            const scoreStr = params.get(cat.id);
            const score = parseInt(scoreStr, 10);

            if (!isNaN(score)) validScores++;

            const levelData = getResultLevel(score, cat.breaks) || {
                level: "Bilinmiyor",
                desc: "-",
                color: "text-slate-500",
                bg: "bg-slate-50",
                border: "border-slate-200",
                icon: "❓"
            };

            if (levelData.level === "Kesin Farklı") definiteCount++;
            if (levelData.level === "Fark Görülebilir") probableCount++;

            return {
                ...cat,
                score,
                ...levelData
            };
        });

        if (validScores > 0) {
            setResults(calculatedResults);

            if (definiteCount > 0) {
                setOverallStatus({
                    title: "Duyu Bütünleme Değerlendirmesi Önerilir",
                    desc: "Verdiğiniz cevaplara göre çocuğunuzun bazı duyusal alanlarda günlük yaşamını etkileyen kesin farklılıkları olabilir. Bir pediatrik fizyoterapistten detaylı değerlendirme almanız faydalı olacaktır.",
                    color: "text-rose-600",
                    bg: "bg-rose-50"
                });
            } else if (probableCount > 0) {
                setOverallStatus({
                    title: "Hafif Duyusal Hassasiyetler Gözlemlendi",
                    desc: "Çocuğunuz bazı duyusal alanlarda hafif hassasiyetler yaşıyor olabilir. Evde uygulayabileceğiniz basit duyusal oyunlarla onu destekleyebilir ve durumunu gözlemlemeye devam edebilirsiniz.",
                    color: "text-amber-600",
                    bg: "bg-amber-50"
                });
            } else {
                setOverallStatus({
                    title: "Duyusal Gelişimi Dengede Görünüyor",
                    desc: "Harika! Çocuğunuzun duyusal işlemleme becerileri tüm alanlarda yaşıtlarıyla uyumlu (Tipik Performans) görünüyor. Gelişimini oyunlarla desteklemeye devam edebilirsiniz.",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50"
                });
            }
        }
    }, []);

    if (!overallStatus) {
        return (
            <div className="max-w-4xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl text-center">
                <p className="text-slate-500">Sonuçlar yükleniyor veya geçersiz test verisi...</p>
                <a href="/quiz" className="text-orange-500 hover:underline mt-4 inline-block">Teste Dön</a>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
            {/* Overall Summary Header */}
            <div className={`text-center p-8 rounded-3xl mb-12 ${overallStatus.bg}`}>
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-4xl">📊</span>
                </div>
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${overallStatus.color}`}>
                    {overallStatus.title}
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                    {overallStatus.desc}
                </p>
            </div>

            {/* Detailed Categories List */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-800 mb-6 px-2">Kategori Bazlı Detaylı Analiz</h3>
                <div className="grid gap-4">
                    {results.map((res, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-2xl border ${res.border} ${res.bg} transition-all`}>
                            <div className="flex items-center gap-3 mb-3 md:mb-0">
                                <span className="text-2xl" aria-hidden="true">{res.icon}</span>
                                <h4 className="font-bold text-slate-800 text-lg">{res.name}</h4>
                            </div>

                            <div className="flex items-center justify-between md:justify-end md:gap-6 bg-white/60 p-3 md:p-0 md:bg-transparent rounded-xl">
                                <span className={`font-bold px-4 py-1.5 rounded-full text-sm md:text-base ${res.color} bg-white shadow-sm border ${res.border}`}>
                                    {res.level}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-slate-400 mt-4 px-2 italic">
                    * Tipik Performans (Uyumlu), Fark Görülebilir (Hafif), Kesin Farklı (Belirgin) olarak derecelendirilmiştir. Bu test tıbbi bir tanı yerine geçmez.
                </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl mb-10 text-center">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🎁 Hediyeniz Hazır!</h3>
                <p className="text-blue-700 mb-6 font-medium max-w-xl mx-auto">
                    Çocuğunuzun gelişimi için hazırladığım "5 Duyu Bütünleme Egzersizi" rehberini şimdi indirebilirsiniz.
                </p>
                <a href="/assets/duyu-butunleme-egzersizleri.pdf" download className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-colors shadow-lg shadow-blue-200 hover:shadow-blue-300">
                    📥 PDF Rehberi İndir
                </a>
            </div>

            <div className="text-center mb-8">
                <a href="/quiz" className="text-slate-400 hover:text-slate-600 text-sm font-semibold underline">
                    Testi Tekrarla
                </a>
            </div>

            <div className="border-t border-slate-100 pt-8">
                <ResultContactForm />
            </div>
        </div>
    );
}

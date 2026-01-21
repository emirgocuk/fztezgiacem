import React, { useEffect, useState } from 'react';
import ResultContactForm from './ResultContactForm';

export default function QuizResult() {
    const [score, setScore] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const scoreParam = params.get('score');
        if (scoreParam) {
            setScore(parseInt(scoreParam, 10));
        }
    }, []);

    const getResult = () => {
        if (score <= 5) {
            return {
                title: "Duyusal Gelişimi Dengede Görünüyor",
                desc: "Çocuğunuzun duyusal işlemleme becerileri yaşıtlarıyla uyumlu görünüyor. Yine de gelişimini desteklemek için oyun temelli aktiviteler yapmaya devam edebilirsiniz.",
                color: "text-green-600",
                bg: "bg-green-50"
            };
        } else if (score <= 12) {
            return {
                title: "Hafif Duyusal Hassasiyetler Olabilir",
                desc: "Çocuğunuz bazı duyusal alanlarda hassasiyet yaşıyor olabilir. Evde uygulayabileceğiniz basit duyusal oyunlarla onu destekleyebilirsiniz.",
                color: "text-orange-500",
                bg: "bg-orange-50"
            };
        } else {
            return {
                title: "Duyu Bütünleme Değerlendirmesi Önerilir",
                desc: "Verdiğiniz cevaplara göre çocuğunuzun günlük yaşamını etkileyen duyusal farklılıkları olabilir. Bir pediatrik fizyoterapistten detaylı değerlendirme almanız faydalı olabilir.",
                color: "text-red-500",
                bg: "bg-red-50"
            };
        }
    };

    const result = getResult();

    return (
        <div className="max-w-4xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${result.bg}`}>
                <span className="text-5xl">📊</span>
            </div>
            <h2 className={`text-3xl font-bold mb-6 ${result.color}`}>{result.title}</h2>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">{result.desc}</p>

            <div className="bg-blue-50 p-8 rounded-3xl mb-10 max-w-3xl mx-auto">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🎁 Hediyeniz Hazır!</h3>
                <p className="text-blue-700 mb-6 font-medium">
                    Çocuğunuzun gelişimi için hazırladığım "5 Duyu Bütünleme Egzersizi" rehberini şimdi indirebilirsiniz.
                </p>
                <a href="/assets/duyu-butunleme-egzersizleri.pdf" download className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-2xl transition-colors shadow-lg shadow-blue-200 hover:shadow-blue-300">
                    📥 PDF Rehberi İndir
                </a>
            </div>

            <a href="/quiz" className="text-slate-400 hover:text-slate-600 text-sm font-semibold underline block mb-8">
                Testi Tekrarla
            </a>

            <div className="border-t border-slate-100 pt-8">
                <ResultContactForm />
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { pb } from "../lib/pocketbase";

export default function ResultContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Direct Client-Side create
            await pb.collection("messages").create({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message || "Quiz sonucu üzerinden iletişim talebi."
            });

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });

        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (status === 'success') {
        return (
            <div className="bg-green-50 p-8 rounded-3xl text-center border border-green-100">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    ✅
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Bilgileriniz Alındı!</h3>
                <p className="text-green-700">Uzmanımız en kısa sürede size dönüş yapacaktır.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-lg mt-12 text-left">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Uzman Desteği Alın</h3>
            <p className="text-slate-500 mb-6">Sonucunuzu değerlendirmek ve detaylı bilgi almak için bilgilerinizi bırakın, sizi arayalım.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8A65] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="Adınız Soyadınız"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8A65] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Telefon Numarası</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8A65] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        placeholder="05XX XXX XX XX"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Mesajınız (Opsiyonel)</label>
                    <textarea
                        name="message"
                        id="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8A65] focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                        placeholder="Çocuğunuzun durumu hakkında kısa bilgi..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#FF8A65] hover:bg-[#FF7043] text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {status === 'loading' ? 'Gönderiliyor...' : 'Ücretsiz Danışma Talep Et'}
                </button>
            </form>
        </div>
    );
}

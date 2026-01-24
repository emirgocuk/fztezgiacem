import React, { useState } from 'react';
import { pb } from "../lib/pocketbase";

const LeadCaptureForm = ({
    source = "newsletter",
    title = "Güncel Bilgiler İçin Abone Olun",
    buttonText = "Abone Ol",
    successMessage = "Harika! Abone oldunuz. Teşekkürler!",
    className = "",
    inputClassName = "",
    buttonClassName = "",
    onSuccess = () => { } // Default empty function
}) => {
    // Default base classes (can be overridden or appended)
    const baseInputClass = "w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all";
    const defaultInputClass = "border-gray-200 focus:border-primary-500 focus:ring-primary-100 text-gray-700 placeholder-gray-400 bg-white";

    // If inputClassName is provided, we use base + inputClassName.
    const finalInputClass = inputClassName ? `${baseInputClass} ${inputClassName}` : `${baseInputClass} ${defaultInputClass}`;

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            // Direct PocketBase Call (Client-Side)
            await pb.collection("subscribers").create({
                email,
                source,
                active: true
            });

            // Simulate success since PB create worked
            setStatus("success");
            setMessage(successMessage);
            setEmail("");
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setStatus("error");
            // Check for unique constraint (400) - treat as success "Already subscribed" or show error
            // If status 400, it's likely "email already exists"
            if (err.status === 400) {
                setStatus("success");
                setMessage("Zaten abonesiniz veya e-posta geçersiz.");
            } else {
                setMessage("Bağlantı hatası. Lütfen tekrar deneyin.");
            }
        }
    };

    if (status === "success") {
        return (
            <div className={`p-6 bg-green-50 rounded-xl border border-green-100 text-center ${className}`}>
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Teşekkürler!</h3>
                <p className="text-green-700">{message}</p>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-100 p-8 md:p-10 ${className}`}>
            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-emerald-100 opacity-50 blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-orange-100 opacity-50 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 text-center">
                {title && <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">{title}</h3>}
                {title && (
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto text-base leading-relaxed">
                        Çocuğunuzun gelişimi ve fizyoterapi hakkında faydalı bilgiler için bültenimize katılın. <span className="font-medium text-emerald-600">Spam yok, sadece bilgi!</span>
                    </p>
                )}


                <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg mx-auto">
                    <div className="w-full">
                        <label htmlFor="email" className="sr-only">Email Adresi</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email adresiniz"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${baseInputClass} border-gray-200 focus:border-emerald-500 focus:ring-emerald-100 text-gray-800 placeholder-gray-400 bg-gray-50/50`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={buttonClassName || "w-full whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"}
                    >
                        {status === "loading" ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Gönderiliyor...
                            </>
                        ) : (
                            buttonText
                        )}
                    </button>
                </form>
                <p className="text-xs text-gray-400 mt-4 text-center">
                    İstediğiniz zaman tek tıkla abonelikten çıkabilirsiniz.
                </p>
            </div>
        </div>
    );
};

export default LeadCaptureForm;

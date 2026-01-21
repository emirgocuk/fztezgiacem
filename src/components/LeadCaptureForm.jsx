import React, { useState } from 'react';

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
            const res = await fetch("/actions/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, source }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus("success");
                setMessage(successMessage);
                setEmail("");
                if (onSuccess) onSuccess();
            } else {
                setStatus("error");
                setMessage(data.message || "Bir hata oluştu.");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage(" Bağlantı hatası. Lütfen tekrar deneyin.");
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
        <div className={`${className}`}>
            {title && <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>}
            {title && (
                <p className="text-gray-600 mb-4 text-sm">
                    Çocuğunuzun gelişimi ve fizyoterapi hakkında faydalı bilgiler için bültenimize katılın. Spam yok, sadece bilgi!
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label htmlFor="email" className="sr-only">Email Adresi</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email adresiniz"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={finalInputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className={buttonClassName || "w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"}
                >
                    {status === "loading" ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>İşleniyor...</span>
                        </>
                    ) : (
                        <span>{buttonText}</span>
                    )}
                </button>

                {status === "error" && (
                    <div className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default LeadCaptureForm;

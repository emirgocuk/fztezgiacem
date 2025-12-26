/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
    console.log("[HOOK] New message received. Preparing email...");

    // e.record is guaranteed to exist in onRecordAfterCreateSuccess
    const message = e.record;

    try {
        const html = `
            <h3>Yeni İletişim Formu Mesajı</h3>
            <p><strong>İsim:</strong> ${message.get("name")}</p>
            <p><strong>E-posta:</strong> ${message.get("email")}</p>
            <p><strong>Telefon:</strong> ${message.get("phone") || "Belirtilmedi"}</p>
            <p><strong>Mesaj:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #FF8A65;">
                ${message.get("message")}
            </blockquote>
            <p><small>Bu mesaj web sitesi iletişim formundan gönderilmiştir.</small></p>
        `;

        const mail = new MailerMessage({
            from: {
                address: "iletisim@fztezgiacem.com",
                name: "Fzt. Ezgi Acem",
            },
            to: [{ address: "iletisim@fztezgiacem.com" }],
            subject: `Yeni Mesaj: ${message.get("name")}`,
            html: html,
        });

        // Use e.app as per recommended documentation
        e.app.newMailClient().send(mail);
        console.log("[HOOK] ✅ Email sent successfully!");

    } catch (err) {
        console.error("[HOOK] ❌ Email send error:", err);
    }
}, "messages")

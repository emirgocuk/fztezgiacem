/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
    const message = e.record;

    try {
        // Attempt to find the settings record
        // In v0.23+, we use $app.findFirstRecordByFilter
        const result = $app.findFirstRecordByFilter("site_settings", "contact_email != ''");

        if (!result) {
            console.log("No site_settings record found.");
            return;
        }

        const adminEmail = result.get("contact_email");

        if (!adminEmail) {
            console.log("No admin email configured.");
            return;
        }

        const email = new MailerMessage({
            from: {
                address: $app.settings().meta.senderName + " <" + $app.settings().meta.senderAddress + ">",
                name: "Fizyoterapist İletişim Formu",
            },
            to: [{ address: adminEmail }],
            subject: `Yeni Mesaj: ${message.get("name")}`,
            html: `
                <h3>Yeni bir iletişim formu mesajı aldınız.</h3>
                <p><strong>Gönderen:</strong> ${message.get("name")}</p>
                <p><strong>E-posta:</strong> ${message.get("email")}</p>
                <p><strong>Telefon:</strong> ${message.get("phone") || "Belirtilmedi"}</p>
                <p><strong>Mesaj:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #1E3A1A;">
                    ${message.get("message")}
                </blockquote>
                <p><small>Bu mesaj otomatik olarak gönderilmiştir.</small></p>
            `,
        })

        $app.newMailClient().send(email);
        console.log(`Notification sent to ${adminEmail}`);

    } catch (err) {
        console.error("Email notification hook error:", err);
    }

}, "messages")

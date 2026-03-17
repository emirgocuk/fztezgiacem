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

// --- Analytics Tracking Endpoint ---
routerAdd("POST", "/api/track-view", (e) => {
    try {
        const ua = e.request.header.get("User-Agent") || "";
        const uaLower = ua.toLowerCase();
        
        // Simple bot filter
        if (uaLower.includes("bot") || uaLower.includes("spider") || uaLower.includes("crawler") || uaLower.includes("google") || uaLower.includes("bing")) {
            return e.json(200, { success: true, note: "bot ignored" });
        }

        const body = new DynamicModel({
            type: "",
            path: "",
            postId: ""
        });
        
        e.bindBody(body);

        if (body.type === "page") {
             if (body.path && !body.path.includes("/admin")) {
                 const collection = $app.findCollectionByNameOrId("page_views");
                 const record = new Record(collection);
                 record.set("path", body.path);
                 record.set("user_agent", ua);
                 $app.save(record);
             }
        } else if (body.type === "post") {
             if (body.postId) {
                 const post = $app.findRecordById("posts", body.postId);
                 const currentViews = post.get("views") || 0;
                 post.set("views", currentViews + 1);
                 $app.save(post);
             }
        }

        return e.json(200, { success: true });
    } catch (err) {
        console.error("View tracking error:", err);
        return e.json(500, { error: err.message });
    }
});

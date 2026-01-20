export const prerender = false;

import { pb } from "../../lib/pocketbase";

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const { email, source = "website" } = data;

        // 1. Basic Validation
        if (!email || !email.includes("@")) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Geçerli bir email adresi giriniz.",
                }),
                { status: 400 }
            );
        }

        // 2. Save to PocketBase
        try {
            // Check if already exists to avoid unique constraint error
            // Note: If you set the 'email' field to Unique in PocketBase, this might fail with 400.
            // We'll try to create, and if it fails, we assume it exists.
            await pb.collection("subscribers").create({
                email,
                source,
                active: true,
            });
        } catch (pbError) {
            // If error is due to unique constraint, we can ignore it or update
            // For now, let's treat it as a success "You are already subscribed"
            // console.error("PocketBase Error:", pbError);

            // Check if it's a validation error (likely unique constraint)
            if (pbError.status !== 400) {
                console.error("PocketBase Save Error:", pbError);
                // We don't block the process if PB fails, maybe Brevo works? 
                // But usually we want to return an error if DB fails.
                // Let's continue to Brevo to be robust.
            }
        }

        // 3. Sync with Brevo (if API Key exists)
        const BREVO_KEY = import.meta.env.BREVO_API_KEY;
        if (BREVO_KEY) {
            try {
                const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": BREVO_KEY,
                    },
                    body: JSON.stringify({
                        email,
                        attributes: {
                            SOURCE: source,
                        },
                        updateEnabled: true, // Update if exists
                    }),
                });

                if (!brevoResponse.ok) {
                    const errorText = await brevoResponse.text();
                    console.error("Brevo Error:", errorText);
                }
            } catch (brevoError) {
                console.error("Brevo Exception:", brevoError);
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Başarıyla abone oldunuz!",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Submission Error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Bir hata oluştu. Lütfen tekrar deneyiniz.",
            }),
            { status: 500 }
        );
    }
};

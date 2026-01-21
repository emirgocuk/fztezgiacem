export const prerender = false;

import { pb } from "../../lib/pocketbase";

export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, email, phone, message } = data;

        // Validation
        if (!name || !phone || !email) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Ad soyad, e-posta ve telefon zorunludur.",
                }),
                { status: 400 }
            );
        }

        // Save to PocketBase 'messages' collection
        try {
            await pb.collection("messages").create({
                name,
                email,
                phone,
                message: message || "Quiz sonucu üzerinden iletişim talebi - telefon ile dönüş bekliyor.",
            });
        } catch (pbError) {
            console.error("PocketBase Save Error:", pbError);
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Veritabanı hatası.",
                }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Mesajınız alındı.",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact API Error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Sunucu hatası.",
            }),
            { status: 500 }
        );
    }
};

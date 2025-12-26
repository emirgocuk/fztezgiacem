export async function uploadToImgBB(file: File) {
    const apiKey = import.meta.env.PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error("ImgBB API Key eksik! Lütfen .env dosyasına PUBLIC_IMGBB_API_KEY ekleyin.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error?.message || "Resim yükleme başarısız.");
    }

    return data.data.url;
}

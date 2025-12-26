# 🏥 Fizyoterapist Ezgi Acem - Web Sitesi Projesi

Bu proje, **Fizyoterapist Ezgi Acem** için geliştirilmiş modern, hızlı ve dinamik bir kurumsal web sitesidir. 
Teknolojik altyapı olarak **Astro, React, TailwindCSS** ve backend tarafında **PocketBase** kullanılmıştır.

---

## 🏗️ Mimari ve Teknolojiler

- **Frontend:** [Astro](https://astro.build/) (Statik Site Üretimi & SSR)
- **UI Framework:** React (Admin paneli interaktivitesi için)
- **Stil:** TailwindCSS v4
- **Backend:** PocketBase (Golang tabanlı real-time backend)
- **Veritabanı:** SQLite (PocketBase içinde gömülü)
- **Mail Servisi:** Brevo SMTP (PocketBase Hooks ile entegre)

---

## 📂 Proje Yapısı

### `src/pages` (Sayfalar)
- `index.astro`: Ana sayfa. Hero, Hizmetler, Hakkımda özetlerini içerir.
- `hakkimda.astro`: Detaylı biyografi sayfası.
- `iletisim.astro`: İletişim formu ve adres bilgileri.
- `admin/`: Admin paneli sayfaları (Giriş, Dashboard, Blog Yönetimi).
- `blog/`: Blog listesi ve dinamik blog detay sayfaları (`[slug].astro`).

### `src/components` (UI Bileşenleri)
- **`TreatmentProcess.astro`**: Tedavi sürecini anlatan animasyonlu dikey timeline bileşeni.
- **`WorkingAreas.astro`**: Uzmanlık alanlarını grid yapısında listeleyen bileşen.
- **`ScrollToTop.astro`**: Sayfa aşağı inince beliren "Yukarı Çık" butonu.
- **`Footer.astro`**: Site alt bilgisi, sosyal medya linkleri ve iletişim özeti.

### `src/components/admin` (Admin Paneli React Bileşenleri)
- **`TiptapEditor.jsx`**: Blog yazıları için gelişmiş zengin metin editörü (Bold, Italic, Link, H1-H3 vb.).
- **`ImageUploadWithCrop.jsx`**: Blog kapak resimleri için sürükle-bırak destekli, kırpma özellikli resim yükleyici.
- **`ImageCropper.jsx`**: `react-easy-crop` kütüphanesini kullanan yardımcı kırpma bileşeni.

### `src/layouts` (Şablonlar)
- **`BaseLayout.astro`**: Tüm genel sayfaların ana şablonu (Header, Footer, Meta etiketleri).
- **`AdminLayout.astro`**: Admin paneli için sidebar ve yetkilendirme kontrolü içeren şablon.

---

## ⚙️ Backend ve Hook Sistemi

Backend mantığı `pb_hooks` klasörü altında çalışır.

### `pb_hooks/main.pb.js`
Bu dosya, iletişim formundan gelen mesajları işler.
1.  `messages` koleksiyonuna yeni bir kayıt atıldığında (`onRecordAfterCreateSuccess`) tetiklenir.
2.  Gelen mesajın içeriğini (İsim, E-posta, Mesaj) alır.
3.  HTML formatında şık bir e-posta şablonu oluşturur.
4.  Tanımlı SMTP ayarları üzerinden `iletisim@fztezgiacem.com` adresine bildirim gönderir.

**Örnek Kod:**
```javascript
onRecordAfterCreateSuccess((e) => {
    // ... mesaj verilerini al
    e.app.newMailClient().send(mail); // Mail gönder
}, "messages")
```

---

## 🚀 Deployment ve Sunucu Yönetimi

Sunucu tarafında PocketBase çalışmaktadır. Site statik olarak build edilir (`output: static` veya `server` moduna göre değişebilir) ve sunulur.

### Otomatik Hook Güncelleme
Hook dosyasında yapılan bir değişikliği sunucuya atmak için özel bir script geliştirilmiştir. Şifre girmeden tek komutla güncelleme yapar.

**Komut:**
```bash
npm run deploy-hook
```
*Bu komut `main.pb.js` dosyasını sunucuya yükler ve PocketBase servisini yeniden başlatır.*

---

## 🛠️ Kurulum ve Geliştirme

Projeyi yerel ortamda çalıştırmak için:

1.  **Bağımlılıkları Yükle:**
    ```bash
    npm install
    ```

2.  **Geliştirme Sunucusunu Başlat:**
    ```bash
    npm run dev
    ```

3.  **Build Al (Üretime Hazırlık):**
    ```bash
    npm run build
    ```

4.  **Local PocketBase Çalıştır (Opsiyonel):**
    ```bash
    ./pocketbase serve
    ```

---

## 📝 Notlar
- **Admin Girişi:** `/admin` yolundan erişilir.
- **Resimler:** Blog resimleri PocketBase `posts` koleksiyonunda saklanır.
- **SMTP:** Brevo (Sendinblue) altyapısı kullanılmaktadır. Ayarlar PocketBase Admin Panel -> Settings -> Mail Settings altındadır.

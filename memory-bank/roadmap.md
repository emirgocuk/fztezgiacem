# Future Roadmap & Feature Plans

> **Güncellenme Tarihi**: 20 Ocak 2026

## 🎯 Mevcut Durum

### Tamamlanan
- ✅ SSR geçişi (yeni postlar anında görünüyor)
- ✅ Email sistemi (form doldurulunca mail geliyor)
- ✅ SEO optimizasyonları
- ✅ Mobil uyumluluk

### İptal/Ertelenen
- ❌ Docker konteynerizasyon (şimdilik gerek yok)
- ❌ Otomatik yedekleme (30GB yeterli, ileride bakılır)
- ❌ Google Reviews widget (henüz klinik açılmadı)

---

## 🚀 Öncelikli Geliştirmeler

### 1. Email Pazarlama Sistemi (Lead Generation)
**Öncelik**: 🔴 En Yüksek

**Hedef**: Ziyaretçilerin email adreslerini toplayıp, onlara değerli içerikler göndererek potansiyel hastaya dönüştürmek.

#### Strateji: Lead Magnet + Email Sequences

```
Ziyaretçi → Lead Magnet (Ücretsiz PDF/Quiz) → Email Toplama
                        ↓
         Email Dizisi (Nurturing Campaign)
                        ↓
              Randevu Alma / İletişim
```

#### Bileşenler

**A) Lead Magnet Seçenekleri:**
1. **PDF Rehber**: "Evde Yapılabilecek 5 Duyu Bütünleme Egzersizi"
2. **İnteraktif Quiz**: "Çocuğumda Gelişim Geriliği Var Mı?" testi
3. **Video Serisi**: 3 günlük email kursu

**B) Email Toplama Formları:**
- Homepage'de popup/slide-in
- Blog yazılarının sonunda
- Quiz sonuç sayfasında

**C) Email Dizisi (Automation):**
```
Gün 0: Hoş geldin + Lead magnet teslimi
Gün 2: Faydalı bilgi (sensory integration nedir?)
Gün 5: Case study / başarı hikayesi
Gün 7: Soft CTA - ücretsiz değerlendirme teklifi
Gün 14: Hatırlatma + sosyal proof
```

#### Teknik Araçlar
- **Brevo** (zaten entegre) - Email gönderimi + otomasyon
- **PocketBase** - Email listesi depolama
- **Custom React Form** - Lead capture

**Tahmini Süre**: 8-12 saat

---

### 2. İnteraktif Gelişim Testi (Quiz)
**Öncelik**: 🔴 Yüksek

**Konsept**: Ebeveynler 6-8 soruyla çocuklarının gelişimini değerlendiriyor. Sonuçta:
- Düşük risk → Bilgilendirici içerik
- Orta risk → "Uzmanla görüşmenizi öneririz" + WhatsApp
- Yüksek risk → Acil değerlendirme önerisi

**Lead Capture**: Sonucu görmek için email isteme (opsiyonel ama etkili)

**Teknik Plan**:
```
/quiz sayfası
  → React form component
  → Sorular (çoktan seçmeli)
  → Skor hesaplama
  → Sonuç sayfası + email capture
  → PocketBase'e kayıt
  → Brevo'ya subscriber ekleme
```

**Tahmini Süre**: 6-8 saat

---

### 3. PWA (Progressive Web App)
**Öncelik**: 🟡 Orta

Telefon ana ekranına eklenebilir, hızlı erişim.

**Tahmini Süre**: 3-4 saat

---

## 📧 Email Pazarlama - Detaylı Analiz

### İşe Yarar Mı?

**EVET, çok etkili olabilir. Nedenleri:**

1. **Uzun Karar Süreci**: Ebeveynler çocuklarının terapisi için düşünür, araştırır. Email ile "top of mind" kalırsınız.

2. **Güven İnşası**: Ücretsiz değer vererek (PDF, bilgi) güven oluşturursunuz. Sizi tanımayan biri değil, "bize yardım eden uzman" olursunuz.

3. **Düşük Maliyet**: Reklam için para harcamak yerine, bir kez email topladıktan sonra ücretsiz iletişim.

4. **Segmentasyon**: Quiz cevaplarına göre farklı emailler gönderebilirsiniz (örn: duruş bozukluğu vs DEHB)

### Dikkat Edilmesi Gerekenler

1. **KVKK Uyumu**: Email toplarken açık rıza alınmalı
2. **Değer Odaklı**: Satış değil, bilgi paylaşımı öncelikli
3. **Frekans**: Haftada 1'den fazla göndermemek
4. **Unsubscribe**: Kolay çıkış seçeneği (Brevo otomatik ekler)

### Önerilen Akış

```
        [Blog/Quiz/Homepage Ziyareti]
                    ↓
    [Lead Magnet: "Ücretsiz PDF İndir"]
                    ↓
         [Email + Ad Soyad Formu]
                    ↓
    [Brevo'ya ekleme + Tag (kaynak)]
                    ↓
      [Otomatik Email Dizisi Başlar]
                    ↓
    [7-14 gün sonra: Değerlendirme Teklifi]
```

---

## 🛠️ Teknik Borç

### Temizlenmesi Gereken
1. **YAPILACAKLAR.md** - Git merge conflict'leri var
2. **Blog sayfası client-side scripts** - SSR sonrası gereksiz olabilir

---

## 📊 Öncelik Özeti

| # | Özellik | Etki | Efor | Öncelik |
|---|---------|------|------|---------|
| 1 | Email Pazarlama Sistemi | Yüksek | Orta | 🔴 |
| 2 | İnteraktif Quiz | Yüksek | Orta | 🔴 |
| 3 | PWA | Orta | Düşük | 🟡 |


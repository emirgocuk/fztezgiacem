import PocketBase from 'pocketbase';

// ==========================================
// ⚙️ AYARLAR
// ==========================================
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'superadmin@test.com'; // Sizin belirlediğiniz admin
const ADMIN_PASSWORD = '1234567890';

async function setup() {
    const pb = new PocketBase(POCKETBASE_URL);

    console.log(`🔌 ${POCKETBASE_URL} adresine bağlanılıyor...`);

    try {
        await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('✅ Admin girişi başarılı!');
    } catch (err) {
        console.error('❌ GİRİŞ HATASI: Admin bilgileri hatalı veya server kapalı.');
        console.error('   Detay:', err.message);
        process.exit(1);
    }

    // -------------------------------------------------------------------------
    // 1. POSTS Koleksiyonu (SİL VE YENİDEN OLUŞTUR)
    // -------------------------------------------------------------------------
    try {
        console.log('\n📦 "posts" koleksiyonu yapılandırılıyor...');
        try {
            const old = await pb.collections.getOne('posts');
            console.log('   🗑️  Eski/Bozuk "posts" koleksiyonu siliniyor...');
            await pb.collections.delete(old.id);
        } catch (e) { /* Zaten yoksa devam et */ }

        console.log('   ✨ "posts" koleksiyonu oluşturuluyor (v0.24+ Fields yapısı)...');
        await pb.collections.create({
            name: 'posts',
            type: 'base',
            fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true, presentable: false },
                { name: 'category', type: 'text' },
                { name: 'summary', type: 'text' },
                { name: 'content', type: 'editor' }, // HTML için editor tipi
                { name: 'published_date', type: 'date' },
                { name: 'image', type: 'text' } // URL tutacağımız için Text
            ],
            listRule: '', // Public
            viewRule: '', // Public
            createRule: '@request.auth.id != ""', // Sadece admin
            updateRule: '@request.auth.id != ""',
            deleteRule: '@request.auth.id != ""',
        });
        console.log('   ✅ "posts" koleksiyonu DOĞRU ŞEKİLDE OLUŞTURULDU!');
    } catch (err) {
        console.error('   ❌ "posts" hatası:', err.message);
        if (err.data) console.error(err.data);
    }

    // -------------------------------------------------------------------------
    // 2. MESSAGES Koleksiyonu
    // -------------------------------------------------------------------------
    try {
        console.log('\n📦 "messages" koleksiyonu yapılandırılıyor...');
        try {
            const old = await pb.collections.getOne('messages');
            console.log('   🗑️  Eski "messages" koleksiyonu siliniyor...');
            await pb.collections.delete(old.id);
        } catch (e) { /* Yoksa devam et */ }

        await pb.collections.create({
            name: 'messages',
            type: 'base',
            fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'email', type: 'email', required: true },
                { name: 'phone', type: 'text' },
                { name: 'message', type: 'text', required: true }
            ],
            listRule: '@request.auth.id != ""',
            viewRule: '@request.auth.id != ""',
            createRule: '', // Herkes mesaj atabilir
            updateRule: '@request.auth.id != ""',
            deleteRule: '@request.auth.id != ""',
        });
        console.log('   ✅ "messages" koleksiyonu DOĞRU ŞEKİLDE OLUŞTURULDU!');

    } catch (err) {
        console.error('   ❌ "messages" hatası:', err.message);
    }

    // -------------------------------------------------------------------------
    // 3. APP USER
    // -------------------------------------------------------------------------
    try {
        console.log('\n👤 Site kullanıcısı (users) kontrol ediliyor...');
        // Users her zaman sistem tarafından oluşturulur, sadece güncellememiz yeterli olabilir
        // Ama temizlik sonrası silinmiş olabilir mi? Users silinemez system collection.
        // Sadece kayıt ekleyeceğiz.

        try {
            const existingUser = await pb.collection('users').getFirstListItem(`email="${ADMIN_EMAIL}"`);
            console.log('   ℹ️ Kullanıcı zaten var. Şifresi güncelleniyor...');
            await pb.collection('users').update(existingUser.id, {
                password: ADMIN_PASSWORD,
                passwordConfirm: ADMIN_PASSWORD,
                verified: true
            });
            console.log('   ✅ Kullanıcı güncellendi.');
        } catch (e) {
            console.log('   ✨ Kullanıcı oluşturuluyor...');
            await pb.collection('users').create({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                passwordConfirm: ADMIN_PASSWORD,
                name: 'Super Admin',
                verified: true
            });
            console.log('   ✅ Kullanıcı oluşturuldu.');
        }

    } catch (err) {
        console.error('   ❌ Users hatası:', err.message);
    }

    console.log('\n🎉 KURULUM VE ONARIM TAMAMLANDI! ŞİMDİ TEST EDEBİLİRSİNİZ.');
}

setup();

import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const pbUrl = process.env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
    console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
    process.exit(1);
}

const pb = new PocketBase(pbUrl);

// Helper to create slug
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

const posts = [
    {
        title: "Çocuklarda Duyu Bütünleme Terapisi Nedir?",
        slug: "cocuklarda-duyu-butunleme-terapisi-nedir",
        summary: "Çocuğunuzun duyusal dünyasını anlamak ve gelişimini desteklemek için duyu bütünleme terapisinin önemini keşfedin.",
        image: "https://i.ibb.co/zHmFczQP/c635a5fa7c78.jpg",
        content: `
      <p>Duyu bütünleme, beynimizin çevreden ve vücudumuzdan gelen duyusal bilgileri (görme, işitme, dokunma, tat, koku, denge ve vücut farkındalığı) alması, işlemesi ve bunlara uygun tepkiler oluşturması sürecidir. Bu süreç, çocukların öğrenmesi, hareket etmesi ve sosyal hayata katılması için temel bir yapı taşıdır.</p>
      
      <h2>Neden Önemlidir?</h2>
      <p>Bazı çocuklar duyusal girdileri işlemede zorluk yaşayabilirler. Bu durum, aşırı hareketlilik, dikkat dağınıklığı, sese veya dokunmaya karşı aşırı hassasiyet ya da tam tersi duyarsızlık gibi belirtilerle kendini gösterebilir. Duyu bütünleme terapisi, bu zorlukları aşmak için çocuğun sinir sistemini "doğru dozda" uyaranlarla eğiterek daha organize ve uyumlu tepkiler vermesini sağlar.</p>

      <h2>Terapide Neler Yapılır?</h2>
      <p>Terapi seansları genellikle çocuklar için özel olarak tasarlanmış, oyun temelli ortamlarda gerçekleştirilir. Bu ortamlarda:</p>
      <ul>
        <li><strong>Salıncaklar ve Tırmanma Alanları:</strong> Denge (vestibüler) sistemini destekler.</li>
        <li><strong>Dokunsal Aktiviteler:</strong> Farklı dokularla çalışma, çocuğun dokunma hassasiyetini veya arayışını düzenler.</li>
        <li><strong>Vücut Farkındalığı Egzersizleri:</strong> Ağır battaniyeler veya tüneller, proprioseptif (kas-eklem) duyuyu geliştirir.</li>
      </ul>

      <p>Bu yaklaşım, çocuğun sadece motor becerilerini değil, aynı zamanda özgüvenini, sosyal ilişkilerini ve akademik başarısını da olumlu yönde etkiler.</p>
    `
    },
    {
        title: "Bebeklerde Motor Gelişim: İlk Adımlar ve İpuçları",
        slug: "bebeklerde-motor-gelisim-ilk-adimlar",
        summary: "Bebeğinizin kaba ve ince motor gelişim basamaklarını takip edin ve evde destekleyici aktiviteler öğrenin.",
        image: "https://i.ibb.co/JW1ZxdDX/da1466b55b5b.jpg",
        content: `
      <p>Bebeklerin motor gelişimi, baş kontrolünden başlayarak yuvarlanma, oturma, emekleme ve nihayetinde yürüme ile devam eden büyüleyici bir süreçtir. Her bebeğin gelişim hızı farklı olsa da, belirli kilometre taşları (milestones) bize yol gösterir.</p>

      <h2>Temel Dönüm Noktaları</h2>
      <ul>
        <li><strong>0-3 Ay:</strong> Baş kontrolünü sağlamaya başlar, yüzüstü yatarken başını kaldırabilir.</li>
        <li><strong>4-6 Ay:</strong> Destekli oturabilir, nesnelere uzanma ve kavrama becerileri gelişir. Yuvarlanmaya başlayabilir.</li>
        <li><strong>7-9 Ay:</strong> Desteksiz oturur, emekleme pozisyonuna geçer ve cisimleri bir elinden diğerine aktarabilir.</li>
        <li><strong>10-12 Ay:</strong> Tutunarak ayağa kalkar, sıralar ve ilk bağımsız adımlarını atabilir.</li>
      </ul>

      <h2>Aileyi Destekleyen Aktiviteler</h2>
      <p>Bebeğinizin gelişimini desteklemek için karmaşık oyuncaklara ihtiyacınız yoktur. En iyi aktivite, yerde geçirilen zamandır ("Tummy Time"). Karın üstü egzersizler sırt ve boyun kaslarını güçlendirir. Ayrıca, renkli ve sesli oyuncakları ulaşabileceği mesafenin biraz ötesine koyarak onu hareket etmeye teşvik edebilirsiniz.</p>
      
      <p>Unutmayın, motor gelişim sadece fiziksel bir süreç değil, aynı zamanda bebeğinizin dünyayı keşfetme aracıdır.</p>
    `
    },
    {
        title: "Otizm Spektrum Bozukluğunda Fizyoterapinin Rolü",
        slug: "otizm-ve-fizyoterapi",
        summary: "Otizmli çocuklarda motor planlama, denge ve koordinasyon becerilerini geliştirmede fizyoterapinin etkileri.",
        image: "https://i.ibb.co/wFV3MnzW/fd49b5deeb40.jpg",
        content: `
      <p>Otizm Spektrum Bozukluğu (OSB), genellikle sosyal iletişim ve etkileşim zorluklarıyla bilinse de, motor becerilerde gecikmeler ve duyusal hassasiyetler de sıkça görülür. Fizyoterapi, otizmli çocukların bağımsızlıklarını artırmada kritik bir rol oynar.</p>

      <h2>Hangi Alanlarda Destek Sağlanır?</h2>
      <ul>
        <li><strong>Motor Koordinasyon:</strong> Bisiklete binme, top yakalama veya merdiven inip çıkma gibi koordinasyon gerektiren becerilerin geliştirilmesi.</li>
        <li><strong>Denge ve Postür:</strong> Vücut duruşunun düzeltilmesi ve dengenin iyileştirilmesi.</li>
        <li><strong>Duyusal Düzenleme:</strong> Fiziksel aktiviteler aracılığıyla çocuğun uyarılma seviyesinin dengelenmesi (sakinleşmesi veya aktive olması).</li>
      </ul>

      <p>Fizyoterapistler, çocuğun bireysel ihtiyaçlarına göre yapılandırılmış oyunlar ve egzersizler kullanır. Bu sayede çocuk, hem fiziksel olarak güçlenir hem de grup oyunlarına katılma özgüveni kazanır.</p>
    `
    },
    {
        title: "Serebral Palsi (CP) ve Rehabilitasyon Süreci",
        slug: "serebral-palsi-rehabilitasyon",
        summary: "Serebral Palsili çocukların hayat kalitesini artıran modern rehabilitasyon yaklaşımları ve ailenin rolü.",
        image: "https://i.ibb.co/r13c2NF/9ccf93fc05ec.jpg",
        content: `
      <p>Serebral Palsi (CP), gelişmekte olan beynin hasar görmesi sonucu ortaya çıkan, hareket ve duruşu etkileyen kalıcı ancak ilerleyici olmayan bir durumdur. CP'li her çocuğun tablosu farklıdır, bu nedenle rehabilitasyon programı da tamamen kişiye özel olmalıdır.</p>

      <h2>Tedavi Yaklaşımları</h2>
      <ul>
        <li><strong>Fonksiyonel Eğitim:</strong> Çocuğun günlük yaşam aktivitelerinde (oturma, yemek yeme, giyinme) bağımsızlığını artırmaya odaklanır.</li>
        <li><strong>Ortez Kullanımı:</strong> Kas kısalıklarını önlemek ve eklem düzgünlüğünü korumak için uygun cihazların seçimi.</li>
        <li><strong>Nörogelişimsel Tedavi (Bobath):</strong> Normal hareket modellerinin kolaylaştırılması ve anormal kas tonusunun düzenlenmesi.</li>
      </ul>

      <p>Rehabilitasyon süreci bir maraton gibidir. Fizyoterapist, aile ve çocuğun işbirliği içinde çalışması, en iyi sonuçların alınmasını sağlar. Amacımız, çocuğun potansiyelini en üst düzeye çıkararak toplumsal hayata tam katılımını sağlamaktır.</p>
    `
    },
    {
        title: "Çocuklarda Doğru Duruş ve Omurga Sağlığı",
        slug: "cocuklarda-durus-bozukluklari",
        summary: "Teknoloji çağında çocukların omurga sağlığını korumak için dikkat edilmesi gerekenler ve egzersiz önerileri.",
        image: "https://i.ibb.co/VYwhFY0j/0b49a73e8ef9.jpg",
        content: `
      <p>Günümüzde tablet ve telefon kullanımının artması, ağır okul çantaları ve hareketsiz yaşam tarzı, çocuklarda duruş bozukluklarını (postüral bozukluklar) yaygınlaştırmıştır. Erken yaşta kazanılan doğru duruş alışkanlıkları, ileride oluşabilecek kronik ağrıların önüne geçer.</p>

      <h2>Sık Görülen Sorunlar</h2>
      <ul>
        <li><strong>Kifoz (Kamburluk):</strong> Sırtın öne doğru yuvarlanması. Genellikle telefon/tablet kullanımıyla ilişkilidir.</li>
        <li><strong>Skolyoz:</strong> Omurganın yana doğru eğilmesi. Erken teşhis çok önemlidir.</li>
        <li><strong>Başın Öne Eğik Olması (Text Neck):</strong> Boyun kaslarında gerginliğe ve baş ağrılarına yol açar.</li>
      </ul>

      <h2>Neler Yapılabilir?</h2>
      <p>Çocuğunuzun çalışma masası ve sandalyesinin ergonomik olduğundan emin olun. Ekran süresini sınırlayın ve açık hava aktivitelerini teşvik edin. Ayrıca, basit sırt güçlendirme ve germe egzersizleri (örneğin "kedi-deve" egzersizi) günlük rutine eklenebilir. Düzenli fizyoterapist kontrolleri ile omurga sağlığını takip etmek en güvenli yoldur.</p>
    `
    },
    {
        title: "Oyun Terapisi: Eğlenirken İyileşmek",
        slug: "oyun-terapisinin-onemi",
        summary: "Oyun, çocuğun işidir. Terapide oyunun nasıl güçlü bir iyileştirme aracına dönüştüğünü öğrenin.",
        image: "https://i.ibb.co/Rk6SKwnJ/793c4b67668a.jpg",
        content: `
      <p>Yetişkinler için konuşmak neyse, çocuklar için oyun odur. Oyun terapisi, çocuğun kendini ifade etmesi, duygularını işlemesi ve yeni beceriler öğrenmesi için en doğal ve etkili yoldur. Fizyoterapi süreçlerinde de oyun, motivasyonu artırmanın anahtarıdır.</p>

      <h2>Oyunun Terapötik Gücü</h2>
      <p>Zorlayıcı bir egzersiz, oyunun içine gizlendiğinde çocuk için bir eğlenceye dönüşür. Örneğin:</p>
      <ul>
        <li>Denge tahtasında yürümek "köprüden geçme macerası" olabilir.</li>
        <li>Tırmanma duvarına çıkmak "elma toplama görevi" olabilir.</li>
        <li>Hamur veya kil ile oynamak, el kaslarını güçlendirirken ince motor becerileri geliştirir.</li>
      </ul>

      <p>Oyun temelli yaklaşım, tedirginliği azaltır, terapist ile çocuk arasında güven bağı kurar ve öğrenilen becerilerin kalıcı olmasını sağlar. Çünkü beyin, keyif aldığı anlarda en iyi öğrenir.</p>
    `
    }
];

async function main() {
    try {
        // Authenticate
        await pb.collection('_superusers').authWithPassword(email, password);
        console.log("Authenticated as admin.");

        for (const post of posts) {
            try {
                // Check if exists
                const existing = await pb.collection('posts').getList(1, 1, {
                    filter: `slug = "${post.slug}"`
                });

                if (existing.items.length > 0) {
                    // Update
                    console.log(`Updating post: ${post.title}`);
                    await pb.collection('posts').update(existing.items[0].id, post);
                } else {
                    // Create
                    console.log(`Creating post: ${post.title}`);
                    await pb.collection('posts').create(post);
                }
            } catch (err) {
                console.error(`Error processing post "${post.title}":`, err.message);
            }
        }
    } catch (err) {
        console.error("Login failed or script error:", err);
    }
}

main();

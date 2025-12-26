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

const posts = [
    {
        title: "Tortikollis (Eğri Boyun) Tedavisinde Erken Müdahale",
        slug: "tortikollis-tedavisinde-erken-mudahale",
        summary: "Bebeklerde sık görülen boyun eğriliği (tortikollis) tedavisinde fizyoterapinin rolü ve ailelere evde uygulanabilecek öneriler.",
        category: "Manuel Terapi",
        image: "https://i.ibb.co/0y6sNcg4/9f0209f7e5ad.jpg",
        published_date: "2025-12-23 09:00:00.000Z",
        content: `
      <p>Tortikollis, bebeğin boynundaki "sternokleidomastoid" (SCM) kasının kısalması veya gerginleşmesi sonucu başın bir yana eğik, yüzün ise diğer yana dönük durması durumudur. Genellikle doğum travması veya anne karnındaki pozisyonlanma kaynaklı olabilir.</p>

      <h2>Neden Erken Müdahale Şarttır?</h2>
      <p>Erken dönemde başlanan fizyoterapi, kasın kalıcı olarak kısalmasını ve yüzde asimetri oluşmasını engeller. Tedavi edilmezse:</p>
      <ul>
        <li>Kafatası şekil bozuklukları (Plagiosefali) gelişebilir.</li>
        <li>Görsel algı ve denge sistemi etkilenebilir.</li>
        <li>İlerleyen yaşlarda omurga eğrilikleri görülebilir.</li>
      </ul>

      <h2>Tedavi Sürecinde Neler Yapıyoruz?</h2>
      <p>Tedavimiz tamamen bebeğin konforuna odaklıdır, ağrısız ve oyun temellidir:</p>
      <ul>
        <li><strong>Germe Egzersizleri:</strong> Kısa olan kasın nazikçe uzatılması.</li>
        <li><strong>Pozisyonlama:</strong> Bebeğin kısıtlı olduğu tarafa bakmasını teşvik edecek şekilde yatağının ve oyuncaklarının düzenlenmesi.</li>
        <li><strong>Güçlendirme:</strong> Boyun kaslarını dengelemek için karşı tarafın kuvvetlendirilmesi.</li>
      </ul>
      
      <p>Ailenin evde yapacağı egzersizler tedavinin başarısını %100 etkiler. Bu yüzden her seansta anne-babaya detaylı eğitim veriyoruz.</p>
    `
    },
    {
        title: "Brakial Pleksus Yaralanmalarında Fizyoterapi Süreci",
        slug: "brakial-pleksus-yaralanmalari",
        summary: "Doğum sırasında oluşan kol siniri yaralanmalarında (Erb felci vb.) iyileşme süreci ve kol fonksiyonlarını geri kazanma stratejileri.",
        category: "Genel",
        image: "https://i.ibb.co/Q32bw0nZ/7be08551a8ab.jpg",
        published_date: "2025-12-23 10:00:00.000Z",
        content: `
      <p>Brakial pleksus, boyundan çıkıp kola giden sinir ağıdır. Doğum sırasında bu sinirlerin gerilmesi veya kopması sonucu kolda hareket kaybı oluşabilir. Bu durum aileler için korkutucu olsa da, sinirlerin kendini yenileme kapasitesi (nöroplastisite) ve doğru fizyoterapi ile yüz güldürücü sonuçlar almak mümkündür.</p>

      <h2>Tedavinin Altın Kuralları</h2>
      <ul>
        <li><strong>Eklem Hareket Açıklığı:</strong> Eklem donukluğunu önlemek için pasif egzersizler ilk günden başlanmalıdır.</li>
        <li><strong>Duyu Girdisi:</strong> Etkilenen kolun farkındalığını artırmak için farklı dokularla masaj ve fırçalama teknikleri uygulanır.</li>
        <li><strong>Aktif Harekete Teşvik:</strong> Bebek büyüdükçe oyuncağa uzanma, emekleme ve tırmanma gibi aktivitelerle kaslar güçlendirilir.</li>
      </ul>

      <p>Amacımız, çocuğun etkilenen kolunu günlük yaşamda (giyinme, yemek yeme, oyun oynama) diğer eli kadar aktif kullanabilmesini sağlamaktır. Ortez kullanımı ve gerekirse cerrahi sonrası rehabilitasyon da sürecin bir parçasıdır.</p>
    `
    },
    {
        title: "Riskli Bebeklerde Gelişim Takibinin Önemi",
        slug: "riskli-bebek-gelisim-takibi",
        summary: "Zorlu bir doğum öyküsü olan bebeklerde gelişimsel gecikmeleri önlemek için yapılan nörolojik ve motor değerlendirmeler.",
        category: "Egzersiz",
        image: "https://i.ibb.co/p6PbDghX/84f55258d165.jpg",
        published_date: "2025-12-23 11:30:00.000Z",
        content: `
      <p>"Riskli Bebek" terimi, doğum öncesinde, sırasında veya sonrasında gelişimi olumsuz etkileyebilecek biyolojik veya çevresel faktörlere maruz kalan bebekler için kullanılır. Bu grupta zor doğumlar, oksijensiz kalma (asfiksi), düşük doğum ağırlığı gibi durumlar yer alır.</p>

      <h2>Neleri Takip Ediyoruz?</h2>
      <p>Fizyoterapist olarak bebeğin sadece kas gücüne değil, genel nörolojik tablosuna bakarız:</p>
      <ul>
        <li><strong>Spontan Hareketler (General Movements):</strong> Bebeğin doğal kıpırdanmalarının kalitesi beyin gelişimi hakkında ipuçları verir.</li>
        <li><strong>Postüral Tonus:</strong> Kas gerginliğinin çok düşük (hipotoni) veya çok yüksek (hipertoni) olması.</li>
        <li><strong>Refleksler:</strong> İlkel reflekslerin zamanında kaybolup kaybolmadığı.</li>
      </ul>

      <p>Riskli bebek danışmanlığında amaç bir "hastalık" tanısı koymak değil, olası gecikmeleri henüz ortaya çıkmadan tespit edip beynin esnekliğinden (plastisite) yararlanarak gelişimsel basamakları desteklemektir.</p>
    `
    },
    {
        title: "Prematüre Bebeklerde Evde Destek ve Pozisyonlama",
        slug: "premature-bebek-gelisimi",
        summary: "Erken doğan kahramanlarımızın kuvöz sonrasında evdeki adaptasyon sürecini kolaylaştıracak ipuçları ve güvenli tutuş teknikleri.",
        category: "Genel",
        image: "https://i.ibb.co/bMP42mFd/d422a5a6f820.jpg",
        published_date: "2025-12-23 14:00:00.000Z",
        content: `
      <p>Prematüre bebekler, dünyaya planlanandan biraz daha erken "merhaba" diyen savaşçılardır. Sinir sistemleri ve kas yapıları henüz yerçekimine tam hazır olmayabilir. Bu nedenle evdeki bakım, onların motor gelişimi için kritik öneme sahiptir.</p>

      <h2>Önemli İpuçları</h2>
      <h3>1. Yuva (Nest) Hissi Yaratmak</h3>
      <p>Anne karnındaki o güvenli, sarıp sarmalanmış hissi devam ettirmek için yataklarında havlularla desteklenmiş "yuva" benzeri sınırlar oluşturmak bebeği sakinleştirir ve enerjisini büyümesi için korur.</p>

      <h3>2. Kanguru Bakımı (Ten Tene Temas)</h3>
      <p>Bebeğin anne veya baba göğsünde çıplak tenle yatması, kalp ritmini düzenler, vücut ısısını korur ve güvenli bağlanmayı sağlar. Fiziksel gelişim kadar duygusal gelişim için de vazgeçilmezdir.</p>

      <h3>3. Yüzüstü Zamanı (Tummy Time)</h3>
      <p>Uyanık ve keyifli olduğu anlarda, gözetim altında karın üstü yatırmak boyun ve sırt kaslarını güçlendirir. Bu pozisyon ilerideki emekleme ve yürüme becerilerinin temelidir.</p>
    `
    },
    {
        title: "Spina Bifida ve Hayata Tam Katılım",
        slug: "spina-bifida-rehabilitasyon",
        summary: "Spina Bifidalı çocukların bağımsızlık yolculuğunda fizyoterapi, ortez kullanımı ve sporun gücü.",
        category: "Egzersiz",
        image: "https://i.ibb.co/tPF4YBVW/bd81d8cf6405.jpg",
        published_date: "2025-12-23 16:45:00.000Z",
        content: `
      <p>Spina Bifida, omurganın anne karnında tam kapanamaması sonucu oluşan bir durumdur. Ancak bu durum, çocuğun aktif, neşeli ve başarılı bir hayat sürmesine engel değildir. Modern rehabilitasyon yaklaşımları ile sınırlar ortadan kalkıyor.</p>

      <h2>Fizyoterapide Odaklandığımız Noktalar</h2>
      <ul>
        <li><strong>Kas Kuvveti ve Denge:</strong> Gövde kontrolünü artırarak oturma ve ayakta durma becerilerini geliştirmek.</li>
        <li><strong>Mesane ve Bağırsak Eğitimi:</strong> Tuvalet alışkanlığının kazanılması ve pelvik taban kaslarının desteklenmesi.</li>
        <li><strong>Uygun Cihazlama:</strong> Çocuğun seviyesine uygun uzun yürüme cihazları, AFO'lar veya tekerlekli sandalye ile maksimum mobilitesinin sağlanması.</li>
      </ul>

      <p>Spina Bifidalı çocuklarımız sadece yürümeyi değil, yüzmeyi, basketbol oynamayı ve dans etmeyi de öğrenebilirler. Bizim görevimiz onlara "yapamazsın" demek değil, "nasıl yapabiliriz"i bulmaktır.</p>
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
                    const recordID = existing.items[0].id;
                    // We spread the post object to update all fields including dates
                    await pb.collection('posts').update(recordID, post);
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

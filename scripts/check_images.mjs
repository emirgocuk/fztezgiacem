import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        const posts = await pb.collection('posts').getFullList();
        console.log(JSON.stringify(posts.map(p => ({ title: p.title, image: p.image })), null, 2));
    } catch (err) {
        console.error(err);
    }
}

main();

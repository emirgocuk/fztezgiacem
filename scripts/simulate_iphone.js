
import { webkit, devices } from 'playwright';

(async () => {
    console.log('🍎 Launching iPhone 13 Pro Simulator (WebKit/Safari Engine)...');

    const browser = await webkit.launch({ headless: false });
    const context = await browser.newContext({
        ...devices['iPhone 13 Pro'],
        locale: 'tr-TR',
    });

    const page = await context.newPage();

    console.log('🌐 Loading fztezgiacem.com...');
    await page.goto('https://fztezgiacem.com');

    console.log('✅ Simulation Ready!');
    console.log('ℹ️  You can now interact with the window.');
    console.log('ℹ️  Test scrolling (flickering) and minimize/restore (white screen).');
    console.log('ℹ️  Press Ctrl+C in terminal to close.');

    // Keep open forever until user closes
    await new Promise(() => { });
})();

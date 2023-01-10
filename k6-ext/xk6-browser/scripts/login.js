import { check } from 'k6';
import { chromium } from 'k6/x/browser';

export default function() {
    const browser = chromium.launch({ headless: false });
    const page = browser.newPage();

    page
        .goto('https://test.k6.io/my_messages.php', { waitUntil: 'networkidle' })
        .then(() => {
            page.locator('input[name="login"]').type('admin');
            page.locator('input[name="password"]').type('123');

            return Promise.all([
                // WaitForNavigation and Click methods are async
                // and return a promise
                page.waitForNavigation(),
                page.locator('input[type="submit"]').click(),
            ]).then(() => {
                check(page, {
                    'header': page.locator('h2').textContent() == 'Welcome, admin!',
                });
            });
    }).finally(() => {
        page.close();
        browser.close();
    });
}

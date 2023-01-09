import { check } from 'k6';
import { chromium } from 'k6/x/browser';
import { Counter } from 'k6/metrics';

const adminMssgsCounter = new Counter('admin_mssgs');

export const options = {
    thresholds: {
      checks: ["rate==1.0"]
    }
  }

export default function() {
    const browser = chromium.launch({ headless: true });
    const page = browser.newPage();

    page
        .goto('https://test.k6.io/my_messages.php', { waitUntil: 'networkidle' })
        .then(() => {
            page.locator('input[name="login"]').type('admin');
            page.locator('input[name="password"]').type('123');

            // Login
            return Promise.all([
                page.waitForNavigation(),
                page.locator('input[type="submit"]').click(),
            ]).then(() => {
                check(page, {
                    'header': page.locator('h2').textContent() == 'Welcome, admin!',
                });
                adminMssgsCounter.add(countTableRows(page));
            });
        }).then(() => {
            // Logout
            return Promise.all([
                page.waitForNavigation(),
                page.locator('input[type="submit"]').click(),
            ]).then(() => {
                check(page, {
                    'logout': page.locator('h2').textContent() == 'Unauthorized',
                });
            });
        }).finally(() => {
            page.close();
            browser.close();
        });
}

function countTableRows(p) {
    return (p.$('tbody').innerHTML().match(/<tr>/g) || []).length - 1; // minus table header
}

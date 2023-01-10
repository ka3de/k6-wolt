import { chromium } from 'k6/x/browser';

export default function () {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  page
    .goto('https://test.k6.io/my_messages.php', { waitUntil: 'networkidle' })
    .then(() => {
      page.locator('input[name="login"]').type('admin');
      page.locator('input[name="password"]').type('123');

      page.screenshot({ path: 'screenshot.png' });
    })
    .finally(() => {
      page.close();
      browser.close();
    });
}

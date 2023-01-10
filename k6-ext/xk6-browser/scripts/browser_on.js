import { chromium } from 'k6/x/browser';
import { check } from 'k6';

export const options = {
    scenarios: {
        happyPath: {
            executor: 'constant-vus',
            exec: 'happyPath',
            vus: 10,
            duration: '10s'
        }
    },
    thresholds: {
        browser_dom_content_loaded: ['p(90) < 500'],
        checks: ["rate==1.0"]
    }
};

export function happyPath() {
    const browser = chromium.launch({
        headless: true,
    });

    browser.on('disconnected').then(() => {
        check(browser, {
            'should be disconnected on event': !browser.isConnected(),
        });
    })

    const page = browser.newPage();
    
    page.goto('https://example.com', { waitUntil: 'networkidle'}).then(() => {
        return Promise.all([
            page.waitForNavigation(),
            page.locator('a').click(),
        ]).then(() => {
            check(page, {
                'header': page.locator('h1').textContent() == 'IANA-managed Reserved Domains',
            });
        });
    }).finally(() => {
        page.close();
        browser.close()
    });
}

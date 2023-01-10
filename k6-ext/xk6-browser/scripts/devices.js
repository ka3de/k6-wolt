import { chromium, devices } from 'k6/x/browser';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    desktop_test: {
      executor: 'constant-vus',
      exec: 'desktop',
      vus: 2,
      duration: '30s',
    },
    mobile_test: {
      executor: 'constant-vus',
      exec: 'mobile',
      vus: 2,
      duration: '30s',
    },
  },
};

export function desktop() {
  const browser = chromium.launch({ headless: true });
  const page = browser.newPage();

  page
    .goto('https://test.k6.io/', { waitUntil: 'networkidle' })
    .finally(() => {
      page.close();
      browser.close();
    });
  
  sleep(1);
}

export function mobile() {
  const browser = chromium.launch({ headless: true });
  const iphoneX = devices['iPhone X'];
  const context = browser.newContext(iphoneX);
  const page = context.newPage();

  page
    .goto('https://test.k6.io/', {
      waitUntil: 'networkidle',
    })
    .then(() => {
      const dimensions = page.evaluate(() => {
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          deviceScaleFactor: window.devicePixelRatio
        };
      });
  
      check(dimensions, {
        'width': d => d.width === iphoneX.viewport.width,
        'height': d => d.height === iphoneX.viewport.height,
        'scale': d => d.deviceScaleFactor === iphoneX.deviceScaleFactor,
      });
    })
    .finally(() => {
      page.close();
      browser.close();
    });

    sleep(1);
}

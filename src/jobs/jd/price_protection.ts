import puppeteer from '@cloudflare/puppeteer';

import { cookieParser } from '../../utils/cookie';

// 一键价保 H5 页面地址
const PAGE_URL = 'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu';

const ONE_BTN_ID = 'one-btn';
const ONE_BTN_DIS_ID = 'one-btn-dis';

export default async function priceProtect(env: Env) {
	const browser = await puppeteer.connect({
		browserWSEndpoint: `wss://browserless.chungguo.me?token=${env.BROWSERLESS_TOKEN}`,
	});

	const cookies = cookieParser(env.JD_COOKIES, '.jd.com');

	const page = await browser.newPage();

	await page.setCookie(...cookies);

	await page.goto(PAGE_URL, {
		waitUntil: 'networkidle0',
	});

	const enabled = await page.waitForSelector(`#${ONE_BTN_ID}`);

	// 一键保价不可见
	const enabledInVisible = enabled?.evaluateHandle((dom) => (dom as HTMLElement).offsetParent === null);

	if (!enabledInVisible) {
		await page.waitForSelector(`#${ONE_BTN_DIS_ID}`, {
			visible: true,
			timeout: 1000,
		});
	}

	const data = await page.evaluate(() => (document.querySelector('.jb-all') as HTMLElement)?.innerText)

	console.log(`[jd][price]: ${data}`);

	await page.close();

	browser.disconnect();

	return data;
}

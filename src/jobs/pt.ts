import puppeteer from '@cloudflare/puppeteer';

import { cookieParser } from '../utils/cookie';

type Site = Record<'host' | 'path' | 'cookies', string>;

/**
 * PT 站点签到
 * */
export default async function attendance(env: Env) {
	const { results } = await env.DB.prepare("SELECT * FROM tb_pt_sites").all<Site>();

	const browser = await puppeteer.connect({
		browserWSEndpoint: `wss://browserless.chungguo.me?token=${env.BROWSERLESS_TOKEN}`,
	});

	const page = await browser.newPage();

	const response = [];

	for (const site of results) {
		const { host, path, cookies } = site;

		const siteCookies = cookieParser(cookies, host);

		await page.setCookie(...siteCookies);

		await page.goto(`https://${host}${path}`, {
			waitUntil: 'networkidle0',
		});

		const text = await page.evaluate(() => document.body.innerText);

		console.log(`[pt][${host}]: ${text}`);

		response.push({
			host,
			text,
		});
	}

	await page.close();

	browser.disconnect();

	return response;
}

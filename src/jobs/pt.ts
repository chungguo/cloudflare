import puppeteer from '@cloudflare/puppeteer';

import { sendTextMessage } from '../tg';
import { cookieParser } from '../utils/cookie';

type Site = Record<'host' | 'path' | 'cookies', string>;

/**
 * PT 站点签到
 * */
export async function attendance(env: Env) {
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
			timeout: 10000,
		});

		const text = await page.evaluate(() => {
			const main = document.querySelector('td#outer table.main');
			const table = main?.querySelector('table');
			return table ? table.textContent : main?.textContent ?? '';
		});

		response.push({
			host,
			text,
		});
	}

	const message = response.reduce((m, item) => {
		const { host, text } = item;
		return `${m} <br/> _${host}_ \n ${text}`;
	}, '*PT 签到*<br/><br/>');

	await page.close();

	await sendTextMessage.call(env, message);

	browser.disconnect();
	return response;
}

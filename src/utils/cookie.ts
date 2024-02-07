// @cloudflare/puppeteer 的依赖
import { Protocol } from 'devtools-protocol';

export const cookieParser = (cookie: string, host: string): Protocol.Network.CookieParam[] =>
	cookie.split(';').reduce((cookies: Protocol.Network.CookieParam[], item) => {
		const [name, value] = item.trim().split('=');
		if (name && value) {
			cookies.push({ name, value, domain: host });
		}
		return cookies;
	}, []);


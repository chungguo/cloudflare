// wrangler d1 execute pt --local --file=./src/db/schema.sql

import ptSitesSignIn from './jobs/pt';
// import priceProtect from './jobs/jd/price_protection';

export default {
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		switch (event.cron) {
			// PT 签到
			case "0 10 * * *":
				await ptSitesSignIn(env);
				break;
			// JD 价格保护
			case "0 12 * * *":
				// await priceProtect(env);
				break;
			default:
				return;
		}
	},
};

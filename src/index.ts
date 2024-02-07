// wrangler d1 execute pt --local --file=./src/db/schema.sql

import attendance from './jobs/pt';
import jdPriceProtect from './jobs/jd/price_protection';

export default {
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		switch (event.cron) {
			// PT 签到
			case "0 10 * * *":
				await attendance(env);
				break;
			// JD 价格保护
			case "0 */1 * * *":
				await jdPriceProtect(env);
				break;
			default:
				return;
		}
	},

	async fetch(request: Request, env: Env) {
		const { url } = request;
		const urlSchema = new URL(url);
		const { pathname } = urlSchema;

		const fn = {
			'/pt': attendance,
			'/jd': jdPriceProtect,
		}[pathname];

		if (!fn) {
			return Response.json({
				success: false,
				message: 'path not existed',
			});
		}

		const data = await fn(env);

		return Response.json({
			success: true,
			data,
		});
	}
};

// wrangler d1 execute pt --local --file=./src/db/schema.sql

import { PT, JD } from './jobs';

export default {
	async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
		switch (event.cron) {
			// PT 签到
			case "0 9 * * *":
				await PT.attendance(env);
				break;
			// JD 价格保护
			case "0 10 * * *":
			case "0 14 * * *":
			case "0 20 * * *":
				await JD.priceProtect(env);
				break;
			default:
				return;
		}
	},
};

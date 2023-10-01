// wrangler d1 execute pt --local --file=./src/db/schema.sql

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to a D1 Database. Learn more at https://developers.cloudflare.com/workers/platform/bindings/#d1-database-bindings
	DB: D1Database
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		const { results } = await env.DB.prepare("SELECT * FROM tb_sites").all();

		const requests = results.map(site => {
			const { host, path, cookies } = site;
			const headers = new Headers();

			headers.append('Cookie', cookies as string);

			return new Request(`https://${host}${path}`, {
				headers,
			});
		});

		for (const r of requests) {
			try {
				const response = await fetch(r);
				const { ok, redirected } = response;
				const success = ok && !redirected;
				console.log(r.url, success)
			} catch (e) {
				console.error(r.url, e)
			}
		}
	},
};

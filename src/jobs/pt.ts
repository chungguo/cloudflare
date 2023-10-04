export default async function signIn(env: Env) {
	const { results } = await env.DB.prepare("SELECT * FROM tb_pt_sites").all();

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
}

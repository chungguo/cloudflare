import { JSDOM, ResourceLoader } from 'jsdom';

interface DOMUtils {
	/** 网关接口加固加签 */
	signWaap: (businessid: string, req: Record<string, any>) => Promise<string>;
}

const utils = (): Promise<DOMUtils> => {
	return new Promise((resolve) => {
		const { window } = new JSDOM(`
		<body>
			<script src="https:////static.360buyimg.com/siteppStatic/script/mescroll/map.js"></script>
			<script src="https://storage.360buyimg.com/webcontainer/js_security_v3_0.1.4.js"></script>
			<script src="https://static.360buyimg.com/siteppStatic/script/utils.js"></script>
			<script src="https://js-nocaptcha.jd.com/statics/js/main.min.js"></script>
		</body>
		`, {
			url: "https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu",
			referrer: "https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu",
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
			runScripts: "dangerously",
			resources: new ResourceLoader({
				userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
			}),
			includeNodeLocations: true,
			storageQuota: 10000000,
			pretendToBeVisual: true,
		});

		window.onModulesLoaded = () => {
			const signWaap = window.signWaap;
			resolve({ signWaap });
		};
	})
}


export default async function priceProtect(env: Env) {
	const time = Date.now();

	const { signWaap } = await utils();

	const body = {
		sid: "",
		type: "25",
		forcebot: "",
	};

	const h5st = await signWaap('d2f64', {
		appid: 'siteppM',
		functionId: 'siteppM_skuOnceApply',
		t: time,
		body: body
	});

	const req = new Request(`https://api.m.jd.com/api?appid=siteppM&functionId=siteppM_appliedSuccAmount&forcebot=&t=${time}`, {
		body: `body=${encodeURIComponent(JSON.stringify(body))}&h5st=${encodeURIComponent(h5st)}`,
		headers: {
			"Host": "api.m.jd.com",
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
			"Origin": "https://msitepp-fm.jd.com",
			"Accept-Language": "zh-CN,zh-Hans;q=0.9",
			"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36",
			"Referer": "https://msitepp-fm.jd.com/",
			"Accept-Encoding": "gzip, deflate, br",
			"Cookie": env.JD_COOKIES
		},
	});

	const res = await fetch(req);

	console.log(await res.json());
}

interface Env {
	// Example binding to a D1 Database. Learn more at https://developers.cloudflare.com/workers/platform/bindings/#d1-database-bindings
	DB: D1Database;

	// 京东cookie
	JD_COOKIES: string;

	// browserless token
	BROWSERLESS_TOKEN: string;
}

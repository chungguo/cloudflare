const MAX_LENGTH = 4096;

export async function sendTextMessage(this: Env, text: string) {
	const response = await fetch(`https://api.telegram.org/bot${this.TELEGRAM_TOKEN}/sendMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			chat_id: this.TELEGRAM_CHAT_ID,
			text: text.substring(0, MAX_LENGTH),
		}),
	});

	return response;
}

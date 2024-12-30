/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


const proxys = {
	'github.com': 'https://github.com',
	'github.io': 'https://github.io',
}


export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (!request.url) {
			return new Response('Hello World!');
		}

		console.log(request.url);

		const srcURL = new URL(request.url);
		let newurl:string

		if (request.url.includes('https://')) {
			newurl = request.url.replace(srcURL.origin + '/', '');
		} else {
			newurl = request.url.replace(srcURL.origin, 'https://github.com');
		}

		console.log(srcURL.origin);

		const req = new Request(newurl, request);
		const res = await fetch(req);
		let newres = new Response(res.body, res);

		let location = newres.headers.get('location');
		console.log(location);
		if (location !== null && location !== "") {

			if (request.url.includes('https://')) {
				location = srcURL.origin+'/'+ location;
			} else {
				location = location.replace('https://github.com', srcURL.origin);
			}

			newres.headers.set('location', location);
		}
		return newres
	},
} satisfies ExportedHandler<Env>;

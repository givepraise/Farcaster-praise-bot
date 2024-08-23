import routes from "./src/routes/routes.js";
import bot from "./src/routes/bot.js";
import {frogApp} from "./src/routes/frog.js";

if (typeof Bun !== 'undefined') {
    const server = Bun.serve({
        fetch: async (req) => {
            try {
                const url = new URL(req.url);
                console.log("Received request! Date: " + new Date());
                switch (url.pathname) {
                    case routes.home:
                        return new Response('This is my Farcaster praise bot', { status: 200 });
                    case routes.bot:
                        return await bot(req);
                    case routes.frog:
                        return await frogApp.fetch(req);
                    default:
                        return new Response('Not Found', { status: 404 });
                }
            } catch (e: any) {
                return new Response(e.message, { status: 500 });
            }
        },
        port: 3000,
    })
    console.log(`Listening on localhost:${server.port}`);
}

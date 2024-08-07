const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        try {
            return new Response("Welcome to my Farcaster praise bot!!!");
        } catch (e: any) {
            return new Response(e.message, { status: 500 });
        }
    },
});

console.log(`Listening on localhost:${server.port}`);
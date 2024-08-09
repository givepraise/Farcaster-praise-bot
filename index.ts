import neynarClient from "./neynarClient";

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        try {
            if (!process.env.SIGNER_UUID) {
                throw new Error("Make sure you set SIGNER_UUID in your .env file");
            }

            const body = await req.text();
            const hookData = JSON.parse(body);

            const reply = await neynarClient.publishCast(
                process.env.SIGNER_UUID,
                `gm ${hookData.data.author.username}`,
                {
                    replyTo: hookData.data.hash,
                }
            );
            console.log("reply:", reply);
            return new Response("Welcome to my Farcaster praise bot!!!!!");
        } catch (e: any) {
            return new Response(e.message, { status: 500 });
        }
    },
});

console.log(`Listening on localhost:${server.port}`);
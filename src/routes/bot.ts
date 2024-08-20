import neynarClient from "../helpers/neynarClient.js";
import routes from "./routes.js";

const bot = async (req: Request) => {
    if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }
    const body = await req.text();
    const hookData = JSON.parse(body);

    const reply = await neynarClient.publishCast(
        process.env.SIGNER_UUID,
        `gm ${hookData.data.author.username}`,
        {
            embeds: [
                {
                    url: process.env.APP_URL + routes.frog,
                },
            ],
            replyTo: hookData.data.hash,
        }
    );

    // const reply = await neynarClient.publishCast(
    //     process.env.SIGNER_UUID,
    //     `gm Ramin`,
    //     {
    //         embeds: [
    //             {
    //                 url: process.env.APP_URL + routes.frog,
    //             },
    //         ],
    //     }
    // );
    console.log("Response sent! Date: " + new Date() + ' ' + reply);
    return new Response(`Replied to the cast with hash: ${reply.hash}`);
}

export default bot;
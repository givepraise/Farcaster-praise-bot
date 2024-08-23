import neynarClient from "../helpers/neynarClient.js";
import routes from "./routes.js";

const bot = async (req: Request) => {
    if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }
    const body = await req.text();
    const hookData = JSON.parse(body);
    const { channel, author, text, mentioned_profiles } = hookData;
    console.log('--------------------')
    console.log('hookData: ', hookData.data)
    console.log('--------------------')
    const praiseHandle = process.env.PRAISE_FARCASTER_HANDLE;
    const praiseReceiver = mentioned_profiles.find((profile: any) => profile.username !== praiseHandle)
    if (!praiseReceiver) {
        await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            `gm ${author.username}! Please mention a Farcaster account to praise for`,
            {
                replyTo: hookData.data.hash,
            }
        );
    }
    let index = text.indexOf('for');
    let reason
    if (index !== -1) {
        reason = text.substring(index);
    } else {
        // There's no 'for' in the praise
        reason = text.split(praiseReceiver.username)[1]
    }
    const query = {
        reason,
        channel,
        giver: author.username,
        recipient: praiseReceiver.verified_addresses.eth_addresses[0] || praiseReceiver.custody_address
    };

    console.log('--------------------')
    console.log('query params: ', query)
    console.log('--------------------')

    const reply = await neynarClient.publishCast(
        process.env.SIGNER_UUID,
        `gm ${author.username}`,
        {
            embeds: [
                {
                    url: process.env.APP_URL + '?' + new URLSearchParams(query),
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
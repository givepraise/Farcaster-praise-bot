import neynarClient from "../helpers/neynarClient.js";

const bot = async (req: Request) => {
    if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }
    const body = await req.text();
    const hookData = JSON.parse(body);
    const { channel, author, text, mentioned_profiles, hash } = hookData.data;
    let praiseIndex = text.indexOf(' praise');
    if (praiseIndex === -1) {
        // There's no 'praise' in the cast
        await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            `GM ${author.username}!
            If you want to give praise to someone and mint an attestation, try casting in the following format:

            @givepraise praise {recipient} for {reason}
            `,
            {
                replyTo: hash,
            }
        );
        console.log("Replied with error: no praise word in the cast!");
        return new Response('There\'s no \'praise\' in the cast', { status: 200 });
    }
    const praiseHandle = process.env.PRAISE_FARCASTER_HANDLE;
    const praiseReceiver = mentioned_profiles.find((profile: any) => profile.username !== praiseHandle)
    if (!praiseReceiver) {
        await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            `GM ${author.username}! Please mention a Farcaster account to praise for`,
            {
                replyTo: hash,
            }
        );
        console.log("Replied with error: no Farcaster account mentioned!");
        return new Response(`Replied to the cast with error: no Farcaster account mentioned`);
    }
    let forIndex = text.indexOf('for');
    let reason
    if (forIndex !== -1) {
        reason = text.substring(forIndex);
    } else {
        // There's no 'for' in the praise
        reason = text.split(praiseReceiver.username)[1]
    }
    const query = {
        reason,
        channel: channel.name,
        giver: author.username,
        recipient: praiseReceiver.verified_addresses.eth_addresses[0] || praiseReceiver.custody_address
    };

    const reply = await neynarClient.publishCast(
        process.env.SIGNER_UUID,
        `gm ${author.username}`,
        {
            embeds: [
                {
                    url: process.env.APP_URL + '?' + new URLSearchParams(query),
                },
            ],
            replyTo: hash,
        }
    );
    console.log("Replied with frame! Date: " + new Date() + ' hash: ' + reply.hash);
    return new Response(`Replied to the cast with hash: ${reply.hash}`);
}

export default bot;
import neynarClient from "../helpers/neynarClient.js";

const bot = async (req: Request) => {
    if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }
    const body = await req.text();
    const hookData = JSON.parse(body);
    const { channel, author, text, mentioned_profiles, hash } = hookData.data;
    console.log("/bot received new request! Date: " + new Date() + ' hash: ' + hash + ' author: ' + author?.username + ' text: ' + text + ' channel: ' + channel?.name);
    if (author.username === process.env.PRAISE_FARCASTER_HANDLE) {
        // The bot should not reply to itself
        console.log("The bot should not reply to itself! Date: " + new Date());
        return new Response('The bot should not reply to itself', { status: 200 });
    }
    let praiseIndex = text.indexOf('@givepraise to @');
    if (praiseIndex === -1) {
        // There's no '@givepraise to @' in the cast
        await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            `GM ${author.username}!

Spread the love by minting a Praise attestation to your friend’s account. Just comment below in the following format:

@givepraise to @YourFriendsHandle for ___

Add your reason for giving praise at the end of the comment and double check that your friend’s Farcaster handle is correct before publishing!
            `,
            {
                replyTo: hash,
            }
        );
        console.log("Replied with error: no '@givepraise to @' in the cast!");
        return new Response('There\'s no \'@givepraise to @\' in the cast', { status: 200 });
    }
    const praiseHandle = process.env.PRAISE_FARCASTER_HANDLE;
    // TODO: Should consider only first mention as praise receiver
    const praiseReceiver = mentioned_profiles.find((profile: any) => profile.username !== praiseHandle)
    if (!praiseReceiver) {
        await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            `GM ${author.username}!
Please mention a Farcaster account to praise for`,
            {
                replyTo: hash,
            }
        );
        console.log("Replied with error: no Farcaster account mentioned!");
        return new Response(`Replied to the cast with error: no Farcaster account mentioned`);
    }
    if (!channel?.name) {
        await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            `GM ${author.username}!
Please cast in a channel to praise`,
            {
                replyTo: hash,
            }
        );
        console.log("Replied with error: no channel mentioned!");
        return new Response(`Replied to the cast with error: no channel mentioned`);
    }
    const reason = text.split(praiseReceiver.username)[1]
    const query = {
        reason,
        channel: channel.name,
        giver: author.username,
        recipientAddress: praiseReceiver.verified_addresses.eth_addresses[0] || praiseReceiver.custody_address,
        recipientName: praiseReceiver.username,
        praiseHash: hash,
    };
    let reply;
    try {
        reply = await neynarClient.publishCast(
            process.env.SIGNER_UUID,
            'Woo! Let\'s mint a Praise attestation to your friend\'s account 🎉 Thanks for helping to foster a culture of on-chain gratitude!',
            {
                embeds: [
                    {
                        url: process.env.APP_URL + '?' + new URLSearchParams(query),
                    },
                ],
                replyTo: hash,
            }
        );
    } catch (e){
        console.log("send frame error! Date " + new Date() + " error: " + e);
        return new Response('Error: ' + e);
    }
    console.log("Replied with frame! Date: " + new Date() + ' hash: ' + reply.hash);
    return new Response(`Replied to the cast with hash: ${reply.hash}`);
}

export default bot;
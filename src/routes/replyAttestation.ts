import neynarClient from "../helpers/neynarClient.js";
import {getProvider} from "../helpers/ethers.js";
import {NETWORK_IDS} from "../helpers/constants.js";

const baseAttestationScan = 'https://base.easscan.org/attestation/view/';

const replyAttestation = async (req: Request) => {
    if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }
    const body = await req.text();
    const data = JSON.parse(body);
    const { txHash, praiseHash } = data;
    const provider = getProvider(NETWORK_IDS.BASE_MAINNET);
    const receipt = await provider.getTransactionReceipt(txHash);
    const attestationHash = receipt?.logs[0]?.data
    if (!attestationHash || !praiseHash) {
        throw new Error("attestationHash and praiseHash are required");
    }
    await neynarClient.publishCast(
        process.env.SIGNER_UUID,
        `Thanks for using Praise and spreading gratitude and thankfulness!
        
This is the attestation URL you just minted:

${baseAttestationScan + attestationHash}`,
        {
            replyTo: praiseHash,
        }
    );
    console.log("Replied with Attestation URL! Date: " + new Date().toISOString());
    return new Response('Attestation URL sent!', { status: 200 });
}

export default replyAttestation;

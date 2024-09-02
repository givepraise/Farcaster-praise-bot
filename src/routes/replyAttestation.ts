import neynarClient from "../helpers/neynarClient.js";
import {getProvider} from "../helpers/ethers.js";
import {NETWORK_IDS} from "../helpers/constants.js";
import {JsonRpcProvider} from "ethers";

const baseAttestationScan = 'https://base-sepolia.easscan.org/attestation/view/';

const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAttestationHash = async (txHash: string, provider: JsonRpcProvider) => {
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt?.logs[0]?.data
}

const replyAttestation = async (req: Request) => {
    if (!process.env.SIGNER_UUID) {
        throw new Error("Make sure you set SIGNER_UUID in your .env file");
    }
    const body = await req.text();
    const data = JSON.parse(body);
    const { txHash, praiseHash } = data;
    if (!txHash || !praiseHash) {
        throw new Error("txHash and praiseHash are required");
    }
    console.log('-----------------');
    console.log('txHash', txHash);
    console.log('praiseHash', praiseHash);
    console.log('-----------------');
    const provider = getProvider(NETWORK_IDS.BASE_SEPOLIA);
    let attestationHash;
    let loopCount = 0;
    while (!attestationHash || loopCount < 10) {
        await wait(5000);
        attestationHash = await getAttestationHash(txHash, provider);
        loopCount++;
        if (loopCount === 10 && !attestationHash) {
            console.log("Attestation hash not found! Date: " + new Date().toISOString() + " txHash: " + txHash + " praiseHash: " + praiseHash);
            throw new Error("Attestation hash not found");
        }
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

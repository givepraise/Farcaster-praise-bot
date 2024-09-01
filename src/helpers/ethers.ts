import {NETWORK_IDS, NETWORK_NAMES} from "./constants.js";
import {ethers} from "ethers";

const INFURA_ID = process.env.INFURA_ID as string;

export function getProvider(networkId: number) {
    let url;
    let options;
    switch (networkId) {
        case NETWORK_IDS.MORDOR_ETC_TESTNET:
            url =
                (process.env.MORDOR_ETC_TESTNET as string) ||
                `https://rpc.mordor.etccooperative.org`;
            break;
        case NETWORK_IDS.ETC:
            url = process.env.ETC_NODE_HTTP_URL as string;
            break;
        case NETWORK_IDS.XDAI:
            url = process.env.XDAI_NODE_HTTP_URL as string;
            break;

        case NETWORK_IDS.BSC:
            // 'https://bsc-dataseed.binance.org/'
            url = process.env.BSC_NODE_HTTP_URL as string;
            options = { name: NETWORK_NAMES.BSC, chainId: NETWORK_IDS.BSC };
            break;

        case NETWORK_IDS.CELO:
            url =
                (process.env.CELO_NODE_HTTP_URL as string) ||
                `https://celo-mainnet.infura.io/v3/${INFURA_ID}`;
            break;

        case NETWORK_IDS.CELO_ALFAJORES:
            url =
                (process.env.CELO_ALFAJORES_NODE_HTTP_URL as string) ||
                `https://celo-alfajores.infura.io/v3/${INFURA_ID}`;
            break;

        case NETWORK_IDS.OPTIMISM_SEPOLIA:
            url = `https://optimism-sepolia.infura.io/v3/${INFURA_ID}`;
            break;

        case NETWORK_IDS.ARBITRUM_MAINNET:
            url =
                (process.env.ARBITRUM_MAINNET_NODE_HTTP_URL as string) ||
                `https://arbitrum-mainnet.infura.io/v3/${INFURA_ID}`;
            break;

        case NETWORK_IDS.ARBITRUM_SEPOLIA:
            url =
                (process.env.ARBITRUM_SEPOLIA_NODE_HTTP_URL as string) ||
                `https://arbitrum-sepolia.infura.io/v3/${INFURA_ID}`;
            break;

        case NETWORK_IDS.BASE_MAINNET:
            url =
                (process.env.BASE_MAINNET_NODE_HTTP_URL as string) ||
                `https://base-mainnet.infura.io/v3/${INFURA_ID}`;
            break;

        case NETWORK_IDS.BASE_SEPOLIA:
            url =
                (process.env.BASE_SEPOLIA_NODE_HTTP_URL as string) ||
                `https://base-sepolia.infura.io/v3/${INFURA_ID}`;
            break;

        // Infura doesn support Polygon ZKEVM
        case NETWORK_IDS.ZKEVM_MAINNET:
            url = process.env.ZKEVM_MAINNET_NODE_HTTP_URL as string;
            break;

        case NETWORK_IDS.ZKEVM_CARDONA:
            url = process.env.ZKEVM_CARDONA_NODE_HTTP_URL as string;
            break;

        case NETWORK_IDS.STELLAR_MAINNET:
            url = process.env.STELLAR_HORIZON_API_URL as string;
            break;

        default: {
            const network = ethers.Network.from(networkId);
            url = `https://${network.name}.infura.io/v3/${INFURA_ID}`;
            break;
        }
    }

    return new ethers.JsonRpcProvider(
        url,
        options,
    );
}

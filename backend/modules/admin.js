import { ethers } from "ethers";
import config from "../config/config.js";

// Setup provider and admin wallet
const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const adminWallet = new ethers.Wallet(config.adminPrivateKey, provider);
const contractAddress = "0x4b83C1b60657833241D83E1a95103fEcd6469399";

// Contract ABI
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "nftType",
                "type": "uint256"
            }
        ],
        "name": "mintNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getOwnedTypes",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contract = new ethers.Contract(contractAddress, contractABI, adminWallet);

/**
 * Mint an NFT using the admin wallet.
 * @param {string} recipient - The recipient's address.
 * @param {number} tokenId - The NFT type ID to be minted.
 * @returns {Promise<object>} Minting result.
 */
export async function mintNFTWithSignature(recipient, tokenId) {
    try {
        console.log(`Minting process started for recipient: ${recipient}, Token ID: ${tokenId}`);

        let estimatedGas;
        try {
            estimatedGas = await contract.mintNFT.estimateGas(recipient, tokenId);
        } catch (gasError) {
            console.warn("Gas estimation failed, using a safe default gas limit.");
            estimatedGas = ethers.toBigInt(500_000); // Default safe gas limit
        }

        const txResponse = await contract.mintNFT(recipient, tokenId, { gasLimit: estimatedGas });
        const receipt = await txResponse.wait();

        console.log(`Minting successful for recipient: ${recipient}, Token ID: ${tokenId}`);
        return { success: true, txReceipt: receipt, message: "NFT minted successfully." };
    } catch (error) {
        let errorMessage = "Minting failed";

        if (error.code === "CALL_EXCEPTION") {
            if (error.reason === "Recipient has already minted this NFT!") {
                console.log(`User ${recipient} has already minted Token ID: ${tokenId}`);
                return { success: true, txReceipt: null, message: "NFT already minted." };
            }
            errorMessage = error.reason || "Transaction reverted";
        } else if (error.message) {
            errorMessage = error.message;
        }

        console.error("Minting error:", errorMessage);

        return { success: false, error: errorMessage };
    }
}

/**
 * Get owned NFT types for a given address.
 * @param {string} address - The wallet address to check.
 * @returns {Promise<number[]>} List of NFT types owned.
 */
export async function getOwnedTypes(address) {
    try {
        const ownedTypes = await contract.getOwnedTypes(address);
        return ownedTypes.map(Number);
    } catch (error) {
        console.error("Error retrieving owned types:", error.message || error);
        return [];
    }
}

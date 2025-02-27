import express from "express";
import cors from "cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import {
    getOAuthURL,
    waitForUserOAuth,
    checkWalletExistence,
    createNewPregenWallet,
    getWallet,
    signMessage,
} from "./modules/paraWallet.js";
import { getOwnedTypes, mintNFTWithSignature } from "./modules/admin.js";

const app = express();

// CORS Configuration
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
        sameSite: "None"
    })
);

app.use(express.json());
app.use(cookieParser());

/**
 * Middleware: Verify if user is logged in (JWT Authentication)
 */
const verifyLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Unauthorized - Invalid or expired token" });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error("❌ Authentication Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Route: Health Check
 */
app.get("/", (req, res) => {
    res.json({ message: "Server is running successfully!" });
});

/**
 * Route: Check if the user is authenticated
 */
app.get("/verifyloggedin", verifyLoggedIn, (req, res) => {
    res.json({ message: "Authenticated" });
});

/**
 * Route: Generate OAuth URL for authentication
 */
app.get("/oauthurl", async (req, res) => {
    try {
        const sessionId = `${Date.now()}-${crypto.randomUUID()}`;
        const oAuthURL = await getOAuthURL(sessionId);
        res.json({ oAuthURL, sessionId });
    } catch (error) {
        console.error("❌ OAuth URL Generation Error:", error);
        res.status(500).json({ error: "Failed to generate OAuth URL" });
    }
});

/**
 * Route: Check OAuth login status and issue a JWT token
 */
app.post("/oauthstatus", async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ error: "Missing sessionId" });
        }

        const response = await waitForUserOAuth(sessionId);
        if (!response.success || !response.data.email) {
            return res.status(400).json({ error: "Invalid OAuth response - Email is empty" });
        }
        const email = response.data.email;

        let walletExists = await checkWalletExistence(email);
        if (!walletExists) {
            await createNewPregenWallet(email);
        }

        const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: "24h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Successfully logged in!" });
    } catch (error) {
        console.error("❌ OAuth Status Error:", error);
        res.status(500).json({ error: "OAuth process failed" });
    }
});

/**
 * Route: Mint NFT with Signature
 */
app.post("/mintNFT", verifyLoggedIn, async (req, res) => {
    try {
        const { recipient, tokenId } = req.body;
        if (!recipient || !tokenId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // 🔍 Normally, the signature verification should be done on-chain using the contract,  
        //     where the contract verifies the signed message to ensure authenticity.  
        // 🔍 However, due to some limitations with `paraEthersSigner`,
        //     we are currently using a **static message signature** as a temporary workaround.  
        // 🔍 In the future, this should be updated to dynamically hash the recipient & tokenId  
        //     and verify it properly on-chain.
        const messageHash = "Minting MammothOS Prestige Badge"; // Temporary static message for now
        const { signature } = await signMessage(messageHash, req.user.email);

        const result = await mintNFTWithSignature(recipient, tokenId);

        res.json(result);
    } catch (error) {
        console.error("❌ NFT Minting Error:", error);
        res.status(500).json({ error: "Failed to mint NFT" });
    }
});

/**
 * Route: Retrieve authenticated user's wallet information
 */
app.get("/getWallet", verifyLoggedIn, async (req, res) => {
    try {
        const response = await getWallet(req.user.email);
        if (!response.success) {
            return res.status(404).json({ error: "Wallet not found" });
        }

        const wallet = response.data;
        const ownedMammothOSBadges = await getOwnedTypes(wallet.address);

        const sanitizedWallet = {
            address: wallet.address,
            type: wallet.type,
            isPregen: wallet.isPregen,
            createdAt: wallet.createdAt,
            partnerName: wallet.partner?.name || null,
            isWithdrawEnabled: wallet.partner?.isWithdrawEnabled || false,
            isBuyEnabled: wallet.partner?.isBuyEnabled || false,
            isReceiveEnabled: wallet.partner?.isReceiveEnabled || false,
            onRampProviders: wallet.partner?.onRampProviders || [],
            ownedMammothOSBadges,
        };

        res.json({ wallet: sanitizedWallet });
    } catch (error) {
        console.error("❌ Wallet Retrieval Error:", error);
        res.status(500).json({ error: "Failed to retrieve wallet" });
    }
});

// Graceful Shutdown Handling
process.removeAllListeners("SIGINT"); 
process.on("SIGINT", () => {
    console.log("\nShutting down server gracefully...");
    process.exit(0);
});

process.on('warning', e => console.warn(e.stack));

// Start the server
app.listen(config.port, () => {
    console.log(`✅ Server is running on port ${config.port}`);
});

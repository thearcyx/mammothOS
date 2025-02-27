import {
  Para as ParaServer,
  Environment,
  OAuthMethod,
  WalletType
} from "@getpara/server-sdk";
import { decrypt, encrypt } from "../helpers/encryption.js";
import { readFromDynamoDB, saveToDynamoDB } from "./dynamoDB.js";
import { ethers } from "ethers";
import { createRequire } from "module";
import config from "../config/config.js";

const require = createRequire(import.meta.url);
const { ParaEthersSigner } = require("@getpara/ethers-v6-integration");

const activeOAuthSessions = new Map();

// Create a ParaServer instance
function createParaInstance() {
  return new ParaServer(Environment.BETA, config.paraApiKey);
}

/**
* Generate OAuth URL for authentication.
* @param {string} sessionId - Unique session identifier.
* @returns {Promise<string>} OAuth URL.
*/
export async function getOAuthURL(sessionId) {
  try {
      const para = createParaInstance();
      activeOAuthSessions.set(sessionId, para);

      // Expire session after 2 minutes
      setTimeout(() => {
          if (activeOAuthSessions.has(sessionId)) {
              console.warn(`OAuth session expired: ${sessionId}`);
              activeOAuthSessions.delete(sessionId);
          }
      }, 2 * 60 * 1000);

      return await para.getOAuthURL({ method: OAuthMethod.TWITTER });
  } catch (error) {
      console.error("OAuth URL Error:", error);
      return { success: false, error: "Failed to generate OAuth URL" };
  }
}

/**
* Wait for user's OAuth login response.
* @param {string} sessionId - Unique session identifier.
* @returns {Promise<object>} OAuth user data.
*/
export async function waitForUserOAuth(sessionId) {
  try {
      const para = activeOAuthSessions.get(sessionId);
      if (!para) {
          return { success: false, error: "OAuth session expired or not found" };
      }

      const user = await para.waitForOAuth();
      activeOAuthSessions.delete(sessionId);
      
      return { success: true, data: user };
  } catch (error) {
      console.error("OAuth Wait Error:", error);
      return { success: false, error: "OAuth process failed" };
  }
}

/**
* Check if the user has a pre-generated wallet.
* @param {string} email - User email.
* @returns {Promise<boolean>} True if wallet exists.
*/
export async function checkWalletExistence(email) {
  try {
      const para = createParaInstance();
      return await para.hasPregenWallet({
          pregenIdentifier: email,
          pregenIdentifierType: "EMAIL"
      });
  } catch (error) {
      console.error("Wallet Check Error:", error);
      return false;
  }
}

/**
* Create a new pre-generated wallet for a user.
* @param {string} email - User email.
* @returns {Promise<object>} Created wallet data.
*/
export async function createNewPregenWallet(email) {
  try {
      const para = createParaInstance();
      const wallet = await para.createPregenWallet({
          type: WalletType.EVM,
          pregenIdentifier: email,
          pregenIdentifierType: "EMAIL"
      });

      const userShare = await para.getUserShare();
      const encryptedKeyShare = encrypt(userShare);

      const data = {
          walletId: wallet.id,
          userShare: encryptedKeyShare,
          email: email
      };

      await saveToDynamoDB(email, data);
      return { success: true, data: wallet };
  } catch (error) {
      console.error("Wallet Creation Error:", error);
      return { success: false, error: "Failed to create a pregen wallet" };
  }
}

/**
* Sign a message using ParaEthersSigner.
* @param {string} messageHash - Message hash to sign.
* @param {string} email - User email.
* @returns {Promise<object>} Signed message.
*/
export async function signMessage(messageHash, email) {
  try {
      const para = createParaInstance();

      const user = await readFromDynamoDB(email);
      if (!user || !user.userShare) {
          return { success: false, error: "User key share not found" };
      }

      const userShare = decrypt(user.userShare);
      await para.setUserShare(userShare);

      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const paraEthersSigner = new ParaEthersSigner(para, provider);

      const signature = await paraEthersSigner.signMessage(messageHash);
      return { success: true, signature };
  } catch (error) {
      console.error("Signing Error:", error);
      return { success: false, error: "Failed to sign the message" };
  }
}

/**
* Retrieve user's wallet.
* @param {string} email - User email.
* @returns {Promise<object>} Wallet data.
*/
export async function getWallet(email) {
  try {
      const para = createParaInstance();

      const user = await readFromDynamoDB(email);

      if (!user || !user.data.userShare) {
          return { success: false, error: "User key share not found" };
      }

      const userShare = decrypt(user.data.userShare);
      await para.setUserShare(userShare);

      const wallets = await para.getWallets();
      const wallet = Object.values(wallets)[0];

      return { success: true, data: wallet };
  } catch (error) {
      console.error("Wallet Retrieval Error:", error);
      return { success: false, error: "Failed to retrieve wallet" };
  }
}

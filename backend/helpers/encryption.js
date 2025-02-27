import CryptoJS from "crypto-js";
import config from "../config/config.js";

/**
 * Get encryption key from config.
 * @returns {CryptoJS.lib.WordArray} Parsed encryption key.
 * @throws {Error} If encryption key is missing or invalid.
 */
function getEncryptionKey() {
    const encryptionKey = config.encryptionKey;

    if (!encryptionKey) {
        throw new Error("Missing ENCRYPTION_KEY in configuration.");
    }
    if (encryptionKey.length !== 32) {
        throw new Error("ENCRYPTION_KEY must be exactly 32 characters long.");
    }

    return CryptoJS.enc.Utf8.parse(encryptionKey);
}

/**
 * Encrypts a given text using AES encryption.
 * @param {string} text - The plaintext to encrypt.
 * @returns {string} The encrypted data in "IV:Ciphertext" format.
 * @throws {Error} If input is missing or encryption fails.
 */
export function encrypt(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Invalid input: Text to encrypt must be a non-empty string.");
    }

    try {
        const iv = CryptoJS.lib.WordArray.random(16);
        const key = getEncryptionKey();

        const encrypted = CryptoJS.AES.encrypt(text, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return `${CryptoJS.enc.Hex.stringify(iv)}:${encrypted.ciphertext.toString()}`;
    } catch (error) {
        console.error("Encryption Error:", error);
        throw new Error("Encryption process failed.");
    }
}

/**
 * Decrypts an AES-encrypted text.
 * @param {string} encryptedText - The encrypted data in "IV:Ciphertext" format.
 * @returns {string} The decrypted plaintext.
 * @throws {Error} If decryption fails.
 */
export function decrypt(encryptedText) {
    if (!encryptedText || typeof encryptedText !== "string" || !encryptedText.includes(":")) {
        throw new Error("Invalid input: Encrypted text must be in 'IV:Ciphertext' format.");
    }

    try {
        const [ivHex, encryptedDataHex] = encryptedText.split(":");

        if (!ivHex || !encryptedDataHex) {
            throw new Error("Malformed encrypted text: Missing IV or ciphertext.");
        }

        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const encryptedData = CryptoJS.enc.Hex.parse(encryptedDataHex);
        const key = getEncryptionKey();

        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: encryptedData });
        const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
            throw new Error("Decryption failed: Incorrect key or corrupted data.");
        }

        return decryptedText;
    } catch (error) {
        console.error("Decryption Error:", error);
        throw new Error("Decryption process failed.");
    }
}

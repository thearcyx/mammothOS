import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import config from "../config/config.js";

// Initialize DynamoDB client
const client = new DynamoDBClient({
    region: "eu-central-1",
    credentials: {
        accessKeyId: config.dynamoDB.accessKey,
        secretAccessKey: config.dynamoDB.secretKey,
    },
});

const docClient = DynamoDBDocumentClient.from(client);

/**
 * Save user data to DynamoDB.
 * @param {string} email - The user's email (Primary Key).
 * @param {object} data - Data to store in DynamoDB.
 * @returns {object} Success message or error.
 */
export async function saveToDynamoDB(email, data) {
    try {
        if (!email || !data) {
            throw new Error("Missing required parameters: email and data");
        }

        const params = {
            TableName: "mammothOSUsers",
            Item: { email, data },
        };

        await docClient.send(new PutCommand(params));
        console.log(`Data successfully saved for user: ${email}`);

        return { success: true, message: "Data saved successfully" };
    } catch (error) {
        console.error("DynamoDB Save Error:", error);
        return { success: false, error: "Failed to save data to DynamoDB" };
    }
}

/**
 * Retrieve user data from DynamoDB.
 * @param {string} email - The email of the user to fetch data for.
 * @returns {object|null} The user's data or null if not found.
 */
export async function readFromDynamoDB(email) {
    try {
        if (!email) {
            throw new Error("Missing required parameter: email");
        }

        const params = {
            TableName: "mammothOSUsers",
            Key: { email },
        };

        const result = await docClient.send(new GetCommand(params));

        if (!result.Item) {
            console.warn(`No data found for user: ${email}`);
            return { success: false, error: "No record found" };
        }

        console.log(`Data successfully retrieved for user: ${email}`);
        return { success: true, data: result.Item.data };
    } catch (error) {
        console.error("DynamoDB Fetch Error:", error);
        return { success: false, error: "Failed to fetch data from DynamoDB" };
    }
}

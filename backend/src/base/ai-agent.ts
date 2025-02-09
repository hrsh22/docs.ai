import { ChatOpenAI, DallEAPIWrapper } from "@langchain/openai";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpTool, CdpToolkit } from "@coinbase/cdp-langchain";
import { Wallet, hashMessage } from "@coinbase/coinbase-sdk";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// Validate environment
function validateEnvironment(): void {
    const requiredVars = ["CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY", "OPENAI_API_KEY"];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error("Missing required environment variables:", missingVars);
        process.exit(1);
    }
}

export async function initializeAgent() {
    validateEnvironment();

    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
    });

    let walletDataStr: string | null = null;

    const WALLET_DATA_FILE = "wallet_data.json";
    if (fs.existsSync(WALLET_DATA_FILE)) {
        try {
            walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
        } catch (error) {
            console.error("Error reading wallet data:", error);
        }
    }

    // Configure CDP with necessary credentials
    const config = {
        apiKeyName: process.env.CDP_API_KEY_NAME,
        apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        cdpWalletData: walletDataStr || undefined,
        networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize AgentKit with configuration
    const agentkit = await CdpAgentkit.configureWithWallet(config);
    const cdpToolkit = new CdpToolkit(agentkit);

    const dallETool = new DallEAPIWrapper({
        n: 1,
        model: "dall-e-3",
        apiKey: process.env.OPENAI_API_KEY,
    });

    const allTools = [...cdpToolkit.getTools(), dallETool];

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

    // Create React Agent with enhanced message modifier for transaction handling
    const agent = createReactAgent({
        llm,
        tools: allTools,
        checkpointSaver: memory,
        messageModifier:
            "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You specialize in handling cryptocurrency transactions. When asked to make a transaction, you will:\n" +
            "1. Verify the wallet address format\n" +
            "2. Confirm the amount is valid and within available balance\n" +
            "3. Execute the transaction using the appropriate tools\n" +
            "4. Provide transaction confirmation\n\n" +
            "You can handle ETH and ERC20 token transfers. Always confirm transaction details before proceeding. If someone asks you to do something you can't do with your currently available tools, you must say so.",
    });

    return { agent, config: agentConfig };
}

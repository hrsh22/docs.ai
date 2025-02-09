import { initializeAgent } from './ai-agent';
import { HumanMessage } from '@langchain/core/messages';

interface TransactionRequest {
    toAddress: string;
    amount: string;
    tokenType?: string; // Optional, defaults to ETH
}

export class TransactionHandler {
    private static agent: any;
    private static isInitialized = false;

    private static async initialize() {
        if (!this.isInitialized) {
            const { agent } = await initializeAgent();
            this.agent = agent;
            this.isInitialized = true;
        }
    }

    public static async handleTransaction(request: TransactionRequest): Promise<string> {
        await this.initialize();

        // Format the transaction request for the agent
        const message = `Please send ${request.amount} ${request.tokenType || 'ETH'} to wallet address ${request.toAddress}`;

        try {
            // Invoke the agent with the transaction request
            const response = await this.agent.invoke([
                new HumanMessage(message)
            ]);

            return response.content;
        } catch (error) {
            console.error('Transaction error:', error);
            throw new Error('Failed to process transaction');
        }
    }

    public static async getWalletBalance(): Promise<string> {
        await this.initialize();

        try {
            const response = await this.agent.invoke([
                new HumanMessage("What is my current wallet balance?")
            ]);

            return response.content;
        } catch (error) {
            console.error('Balance check error:', error);
            throw new Error('Failed to get wallet balance');
        }
    }
} 
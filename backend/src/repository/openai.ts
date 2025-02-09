import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
    apiKey: apiKey
});

const systemPrompt = "You are a specialized legal document analysis assistant. Your primary function is to help users understand and summarize legal documents. Please provide clear, accurate, and concise explanations while maintaining the important legal context and key points. When analyzing documents, focus on: 1) Main legal provisions 2) Key obligations and rights 3) Important dates and deadlines 4) Potential risks or notable conditions.";

export async function generateLegalChatResponse(message: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.3, // Lower temperature for more focused and precise responses
            max_tokens: 500,  // Increased token limit for comprehensive summaries
            presence_penalty: 0,
            frequency_penalty: 0
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating legal chat response:', error);
        throw error;
    }
}

import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = "You are a helpful assistant that can answer questions and help with tasks.";

export async function generateChatResponse(prompt: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            stream: true,
            stream_options: { include_usage: true },
            temperature: 1,
            max_tokens: 100,
            presence_penalty: 0.8,
            frequency_penalty: 0.5
        });
        let content = '';
        for await (const chunk of completion) {
            if (chunk.choices[0]?.delta?.content) {
                content += chunk.choices[0].delta.content;
            }
        }
        return content;
    } catch (error) {
        console.error('Error generating chat response:', error);
        throw error;
    }
}

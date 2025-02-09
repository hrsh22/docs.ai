import { Router, RequestHandler } from 'express';
import { generateLegalChatResponse } from '../repository/openai';

const router = Router();

interface ChatRequest {
    message: string;
}

interface ChatResponse {
    response: string[];
}

const chatHandler: RequestHandler = async (req, res, next): Promise<void> => {
    const { message } = req.body as ChatRequest;

    if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    try {
        const response = await generateLegalChatResponse(message);
        res.json({ response: [response] });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.post('/chat', chatHandler);

export default router; 
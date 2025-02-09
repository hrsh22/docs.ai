// Route handler for '/api/some' endpoint
import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/some/
router.get('/some', (req: Request, res: Response) => {
    res.send('Hello from someRoute!');
});

export default router;
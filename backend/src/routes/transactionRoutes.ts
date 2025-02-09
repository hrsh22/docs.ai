import { Router, Request, Response, NextFunction } from 'express';
import { TransactionHandler } from '../base/transactionHandler';

const router = Router();

interface TransferBody {
    toAddress: string;
    amount: string;
    tokenType?: string;
}

// Route to handle transactions
router.post('/transfer', async (req: Request<{}, {}, TransferBody>, res: Response, next: NextFunction) => {
    try {
        const { toAddress, amount, tokenType } = req.body;

        // Validate required fields
        if (!toAddress || !amount) {
            res.status(400).json({
                error: 'Missing required fields. Please provide toAddress and amount.'
            });
            return;
        }

        // Process the transaction
        const result = await TransactionHandler.handleTransaction({
            toAddress,
            amount,
            tokenType
        });

        res.json({
            success: true,
            message: result
        });
    } catch (error: any) {
        next(error);
    }
});

// Route to check wallet balance
router.get('/balance', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const balance = await TransactionHandler.getWalletBalance();
        res.json({
            success: true,
            balance
        });
    } catch (error: any) {
        next(error);
    }
});

export default router; 
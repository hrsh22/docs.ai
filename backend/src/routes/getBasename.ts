import { Router } from 'express';
import createWalletAndAssignBasename from '../base/register-basename';

const router = Router();

router.post('/getBasename', async (req: any, res: any) => {
    try {
        const { baseName } = req.body;

        if (!baseName) {
            return res.status(400).json({ error: 'baseName is required' });
        }

        const result = await createWalletAndAssignBasename(baseName);

        if (!result) {
            return res.status(500).json({ error: 'Failed to create wallet and assign basename' });
        }

        res.status(200).json({
            message: 'Successfully created wallet and assigned basename',
            wallet: result.wallet,
            baseName: result.baseName
        });
    } catch (error) {
        console.error('Error in basename registration route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

import express from 'express';
import { logUserInteraction } from '../services/dataCapture/logUserInteraction';

const router = express.Router();

router.post('/', async (req, res) => {
    const { type, data } = req.body;
    const userId = req.user?.id || 'anonymous';

    try {
        await logUserInteraction({ userId, type, data });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to track event.' });
    }
});

export default router; 
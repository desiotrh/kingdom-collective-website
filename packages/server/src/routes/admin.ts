import UserInteractionLog from '../services/dataCapture/UserInteractionLog';

router.get('/admin/training-logs', async (req, res) => {
    const logs = await UserInteractionLog.find().sort({ timestamp: -1 }).limit(1000);
    res.json(logs);
}); 
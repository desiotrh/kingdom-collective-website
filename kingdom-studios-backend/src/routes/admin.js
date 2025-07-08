import express from 'express';
const router = express.Router();

// TODO: Implement admin routes
router.get('/stats', (req, res) => {
  res.json({ success: false, error: 'Not implemented yet' });
});

export default router;

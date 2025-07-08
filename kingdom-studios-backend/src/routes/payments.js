import express from 'express';
const router = express.Router();

// TODO: Implement payment routes
router.post('/create-intent', (req, res) => {
  res.json({ success: false, error: 'Not implemented yet' });
});

export default router;

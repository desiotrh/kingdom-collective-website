import express from 'express';
const router = express.Router();

// TODO: Implement user routes
router.get('/profile', (req, res) => {
  res.json({ success: false, error: 'Not implemented yet' });
});

router.put('/profile', (req, res) => {
  res.json({ success: false, error: 'Not implemented yet' });
});

export default router;

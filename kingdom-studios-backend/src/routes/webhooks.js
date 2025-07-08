import express from 'express';
const router = express.Router();

// TODO: Implement webhook routes
router.post('/stripe', (req, res) => {
  res.json({ success: true });
});

export default router;

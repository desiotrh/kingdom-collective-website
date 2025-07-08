import express from 'express';
const router = express.Router();

// TODO: Implement product routes
router.get('/', (req, res) => {
  res.json({ success: false, error: 'Not implemented yet' });
});

router.post('/', (req, res) => {
  res.json({ success: false, error: 'Not implemented yet' });
});

export default router;

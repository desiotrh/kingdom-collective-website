import express from 'express';
const router = express.Router();

// NOTE: Placeholder endpoints. Wire to real implementations later.

router.post('/convert', async (req, res, next) => {
  try {
    return res.json({ ok: true, message: 'convert placeholder' });
  } catch (err) {
    next(err);
  }
});

router.post('/merge', async (req, res, next) => {
  try {
    return res.json({ ok: true, message: 'merge placeholder' });
  } catch (err) {
    next(err);
  }
});

router.post('/ocr', async (req, res, next) => {
  try {
    return res.json({ ok: true, message: 'ocr placeholder' });
  } catch (err) {
    next(err);
  }
});

router.post('/stamp', async (req, res, next) => {
  try {
    return res.json({ ok: true, message: 'stamp placeholder' });
  } catch (err) {
    next(err);
  }
});

export default router;



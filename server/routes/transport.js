import express from 'express';
import { body, validationResult } from 'express-validator';
import Transport from '../models/Transport.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/transport ────────────────────────────────────────────────────────
// Public/Student access to view all routes
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const transports = await Transport.find().sort({ busNumber: 1 });
    res.status(200).json({ success: true, count: transports.length, data: transports });
  })
);

// ── GET /api/transport/:id ────────────────────────────────────────────────────
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Transport route not found' });
    }
    res.status(200).json({ success: true, data: transport });
  })
);

// ── POST /api/transport ───────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('busNumber').isNumeric().withMessage('Bus number must be numeric'),
    body('destination').notEmpty().withMessage('Destination is required'),
    body('areasServed').isArray().withMessage('areasServed must be an array')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const transport = await Transport.create(req.body);
    res.status(201).json({ success: true, data: transport });
  })
);

// ── PUT /api/transport/:id ────────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!transport) {
      return res.status(404).json({ success: false, message: 'Transport route not found' });
    }
    res.status(200).json({ success: true, data: transport });
  })
);

// ── DELETE /api/transport/:id ─────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Transport route not found' });
    }
    res.status(200).json({ success: true, data: {} });
  })
);

export default router;

import express from 'express';
import { body, validationResult } from 'express-validator';
import Resource from '../models/Resource.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// ── GET /api/resources ────────────────────────────────────────────────────────
// Public/Student access to view documents
router.get(
  '/',
  asyncHandler(async (req, res) => {
    let query = {};
    if (req.query.semester) query.semester = req.query.semester;
    if (req.query.branch) query.branch = req.query.branch;
    if (req.query.type) query.type = req.query.type;

    const resources = await Resource.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: resources.length, data: resources });
  })
);

// ── POST /api/resources ───────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize('admin', 'faculty'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('url').isURL().withMessage('Valid URL is required'),
    body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  })
);

// ── PUT /api/resources/:id ────────────────────────────────────────────────────
router.put(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: resource });
  })
);

// ── DELETE /api/resources/:id ─────────────────────────────────────────────────
router.delete(
  '/:id',
  protect,
  authorize('admin', 'faculty'),
  asyncHandler(async (req, res) => {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(200).json({ success: true, data: {} });
  })
);

export default router;

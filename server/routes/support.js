import express from 'express';
import Support from '../models/Support.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

import { sendSupportEmail } from '../utils/mailer.js';

// ── POST /api/support  (public) ───────────────────────────────────────────────
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, phone, usn, message, category, priority, userId } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    const ticket = await Support.create({ name, email, phone, usn, message, category, priority, userId: userId || null });
    sendSupportEmail(ticket);
    res.status(201).json({ success: true, data: ticket });
  })
);

// ── GET /api/support/my  (student: own tickets by email) ──────────────────────
router.get(
  '/my',
  protect,
  asyncHandler(async (req, res) => {
    const tickets = await Support.find({ email: req.user.email }).sort('-createdAt').limit(20);
    res.status(200).json({ success: true, data: tickets });
  })
);

// ── GET /api/support  (admin only) ───────────────────────────────────────────
router.get(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const tickets = await Support.find({}).sort('-createdAt');
    res.status(200).json({ success: true, data: tickets });
  })
);

// ── PATCH /api/support/:id/resolve  (admin only) ─────────────────────────────
router.patch(
  '/:id/resolve',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  })
);

// ── PATCH /api/support/:id/reply  (admin only) ────────────────────────────────
router.patch(
  '/:id/reply',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ success: false, message: 'Reply is required' });
    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      { adminReply: reply, status: 'in-progress' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  })
);

export default router;

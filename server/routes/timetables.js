import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Timetable from '../models/Timetable.js';

const router = express.Router();

// @desc    Get all active sections
// @route   GET /api/timetables
// @access  Public
router.get('/', async (req, res) => {
  try {
    const list = await Timetable.find({}).select('section meta').sort({ section: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get timetable by section
// @route   GET /api/timetables/:section
// @access  Public
router.get('/:section', async (req, res) => {
  try {
    const tt = await Timetable.findOne({ section: req.params.section.toUpperCase() });
    if (!tt) return res.status(404).json({ message: 'Timetable not found for this section' });
    res.json(tt);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create new timetable
// @route   POST /api/timetables
// @access  Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { section, days, teachers, meta } = req.body;
    
    let exists = await Timetable.findOne({ section: section.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: 'Timetable already exists for this section' });
    }

    const tt = await Timetable.create({
      section: section.toUpperCase(),
      days,
      teachers,
      meta
    });

    res.status(201).json(tt);
  } catch (error) {
    res.status(400).json({ message: 'Invalid timetable data', error: error.message });
  }
});

// @desc    Update timetable
// @route   PUT /api/timetables/:section
// @access  Admin
router.put('/:section', protect, authorize('admin'), async (req, res) => {
  try {
    const { days, teachers, meta } = req.body;
    
    let tt = await Timetable.findOne({ section: req.params.section.toUpperCase() });
    if (!tt) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    tt.days = days || tt.days;
    tt.teachers = teachers || tt.teachers;
    tt.meta = meta || tt.meta;

    const updated = await tt.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update timetable', error: error.message });
  }
});

// @desc    Delete timetable
// @route   DELETE /api/timetables/:section
// @access  Admin
router.delete('/:section', protect, authorize('admin'), async (req, res) => {
  try {
    const tt = await Timetable.findOneAndDelete({ section: req.params.section.toUpperCase() });
    if (!tt) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.json({ message: 'Timetable removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;

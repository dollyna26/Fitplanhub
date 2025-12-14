const express = require('express');
const router = express.Router();
const { protect, isTrainer } = require('../middleware/auth');
const FitnessPlan = require('../models/FitnessPlan');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Get all plans (public)
router.get('/', async (req, res) => {
  try {
    const plans = await FitnessPlan.find()
      .select('title price duration durationUnit category difficulty trainer createdAt')
      .populate('trainer', 'name email bio');
    
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single plan (with access control)
router.get('/:id', protect, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id)
      .populate('trainer', 'name email bio certifications');
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const user = await User.findById(req.user._id);
    const hasAccess = user.subscriptions.some(sub => 
      sub.plan.toString() === plan._id.toString()
    );

    if (!hasAccess && req.user._id.toString() !== plan.trainer._id.toString()) {
      // Return preview only
      return res.json({
        _id: plan._id,
        title: plan.title,
        price: plan.price,
        duration: plan.duration,
        durationUnit: plan.durationUnit,
        category: plan.category,
        difficulty: plan.difficulty,
        trainer: plan.trainer,
        hasAccess: false,
        message: 'Subscribe to view full content'
      });
    }

    // Return full content
    res.json({
      ...plan.toObject(),
      hasAccess: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create plan (trainer only)
router.post('/', [
  protect,
  isTrainer,
  body('title').not().isEmpty(),
  body('description').not().isEmpty(),
  body('fullContent').not().isEmpty(),
  body('price').isNumeric(),
  body('duration').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const plan = new FitnessPlan({
      ...req.body,
      trainer: req.user._id
    });

    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update plan (trainer only)
router.put('/:id', protect, isTrainer, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if plan belongs to trainer
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedPlan = await FitnessPlan.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedPlan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete plan (trainer only)
router.delete('/:id', protect, isTrainer, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if plan belongs to trainer
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove plan from user subscriptions
    await User.updateMany(
      { 'subscriptions.plan': plan._id },
      { $pull: { subscriptions: { plan: plan._id } } }
    );

    await plan.deleteOne();
    res.json({ message: 'Plan removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to plan
router.post('/:id/subscribe', protect, async (req, res) => {
  try {
    const plan = await FitnessPlan.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if already subscribed
    const isSubscribed = user.subscriptions.some(sub => 
      sub.plan.toString() === plan._id.toString()
    );

    if (isSubscribed) {
      return res.status(400).json({ message: 'Already subscribed to this plan' });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration);

    // Add subscription to user
    user.subscriptions.push({
      plan: plan._id,
      subscribedAt: Date.now(),
      expiresAt
    });

    // Add user to plan subscribers
    plan.subscribers.push(user._id);

    await user.save();
    await plan.save();

    res.json({ message: 'Successfully subscribed to plan', subscription: user.subscriptions.slice(-1)[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
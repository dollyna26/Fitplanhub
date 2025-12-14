const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const FitnessPlan = require('../models/FitnessPlan');

// Follow/Unfollow trainer
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!trainer || !trainer.isTrainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (trainer._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const isFollowing = user.following.includes(trainer._id);

    if (isFollowing) {
      // Unfollow
      user.following.pull(trainer._id);
      trainer.followers.pull(user._id);
      await user.save();
      await trainer.save();
      res.json({ message: 'Unfollowed successfully', following: false });
    } else {
      // Follow
      user.following.push(trainer._id);
      trainer.followers.push(user._id);
      await user.save();
      await trainer.save();
      res.json({ message: 'Followed successfully', following: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's personalized feed
router.get('/feed', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('following');
    const followingIds = user.following.map(f => f._id);

    // Get plans from followed trainers
    const followedPlans = await FitnessPlan.find({ trainer: { $in: followingIds } })
      .populate('trainer', 'name email bio')
      .sort('-createdAt');

    // Get user's subscribed plans
    const subscribedPlans = await FitnessPlan.find({
      _id: { $in: user.subscriptions.map(s => s.plan) }
    }).populate('trainer', 'name email bio');

    // Combine and mark subscribed plans
    const feed = followedPlans.map(plan => ({
      ...plan.toObject(),
      isSubscribed: user.subscriptions.some(sub => 
        sub.plan.toString() === plan._id.toString()
      )
    }));

    res.json({
      followedPlans: feed,
      subscribedPlans,
      followingCount: followingIds.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get trainer profile
router.get('/trainer/:id', protect, async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name email')
      .populate('following', 'name email');

    if (!trainer || !trainer.isTrainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const plans = await FitnessPlan.find({ trainer: trainer._id })
      .select('title price duration category difficulty subscribers');

    const user = await User.findById(req.user._id);
    const isFollowing = user.following.includes(trainer._id);

    res.json({
      trainer,
      plans,
      isFollowing,
      stats: {
        totalPlans: plans.length,
        totalSubscribers: plans.reduce((acc, plan) => acc + plan.subscribers.length, 0),
        followers: trainer.followers.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
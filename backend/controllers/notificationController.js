import Notification from '../models/Notification.js';

// @desc   Get user notifications
// @route  GET /api/notifications
// @access Private / Public with email query
export const getNotifications = async (req, res) => {
  try {
    const email = req.user ? req.user.email : req.query.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }
    const notifications = await Notification.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Mark notification as read (PATCH/PUT CRUD)
// @route  PATCH /api/notifications/:id/read
// @access Public / Private
export const markNotificationRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    notif.isRead = true;
    await notif.save();
    res.json({ success: true, message: 'Notification marked as read', notification: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete notification (DELETE CRUD)
// @route  DELETE /api/notifications/:id
// @access Public / Private
export const deleteNotification = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    await notif.deleteOne();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

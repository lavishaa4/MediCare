// pages/api/notifications/index.js
import { connectDB } from '../../../lib/mongodb';
import Notification from '../../../models/Notification';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  await connectDB();

  const userId = decoded.userId;

  // GET — list notifications (newest first, last 30)
  if (req.method === 'GET') {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    return res.status(200).json({ notifications, unreadCount });
  }

  // PATCH — mark all as read
  if (req.method === 'PATCH') {
    await Notification.updateMany({ userId, read: false }, { read: true });
    return res.status(200).json({ message: 'All marked as read' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

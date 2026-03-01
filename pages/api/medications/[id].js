// pages/api/medications/[id].js
import { connectDB } from '../../../lib/mongodb';
import Medication from '../../../models/Medication';
import Notification from '../../../models/Notification';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  await connectDB();

  const { id } = req.query;
  const userId = decoded.userId;

  const med = await Medication.findOne({ _id: id, userId });
  if (!med) return res.status(404).json({ error: 'Medication not found' });

  // PUT — update medication or mark as taken
  if (req.method === 'PUT') {
    const { markTaken, ...updates } = req.body;

    if (markTaken) {
      const today = new Date().toISOString().split('T')[0];
      const alreadyLogged = med.adherenceLog.find(l => l.date === today);
      if (!alreadyLogged) {
        med.adherenceLog.push({ date: today, taken: true });
        med.daysLeft = Math.max(0, med.daysLeft - 1);
      }
      med.takenToday = true;
      med.lastTakenAt = new Date();

      // Create success notification every 7-day streak
      const recentTaken = med.adherenceLog.filter(l => l.taken).length;
      if (recentTaken > 0 && recentTaken % 7 === 0) {
        await Notification.create({
          userId,
          type: 'success',
          title: '🎉 Great Adherence!',
          message: `You've taken ${med.name} for ${recentTaken} consecutive days. Keep it up!`,
          relatedId: med._id,
          relatedModel: 'Medication',
        });
      }

      await med.save();
      return res.status(200).json({ medication: med });
    }

    // Regular update
    Object.assign(med, updates);
    await med.save();
    return res.status(200).json({ medication: med });
  }

  // DELETE — soft delete
  if (req.method === 'DELETE') {
    med.active = false;
    await med.save();
    return res.status(200).json({ message: 'Medication removed' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// pages/api/medications/index.js
import { connectDB } from '../../../lib/mongodb';
import Medication from '../../../models/Medication';
import Notification from '../../../models/Notification';
import User from '../../../models/User';
import { requireAuth } from '../../../lib/auth';
import { sendLowStockAlert } from '../../../lib/mailer';

export default async function handler(req, res) {
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  await connectDB();

  const userId = decoded.userId;

  // GET — list all medications
  if (req.method === 'GET') {
    const meds = await Medication.find({ userId, active: true }).sort({ createdAt: -1 });
    return res.status(200).json({ medications: meds });
  }

  // POST — create medication
  if (req.method === 'POST') {
    const { name, dose, frequency, times, condition, color, totalDays, notes, tutorialUrl, tutorialTitle } = req.body;
    if (!name || !dose || !frequency)
      return res.status(400).json({ error: 'Name, dose and frequency are required' });

    const med = await Medication.create({
      userId,
      name, dose, frequency,
      times: times || [],
      condition: condition || '',
      color: color || '#3b6ef8',
      totalDays: totalDays || 30,
      daysLeft: totalDays || 30,
      notes: notes || '',
      tutorialUrl: tutorialUrl || '',
      tutorialTitle: tutorialTitle || '',
    });

    // Check if low stock and notify
    if (med.daysLeft < 10) {
      const user = await User.findById(userId);
      await Notification.create({
        userId,
        type: 'low_stock',
        title: 'Low Medication Stock',
        message: `${med.name} has only ${med.daysLeft} days of supply remaining.`,
        relatedId: med._id,
        relatedModel: 'Medication',
        emailSent: false,
      });
      if (user?.emailNotifications) {
        await sendLowStockAlert({ to: user.email, name: user.name, medName: med.name, daysLeft: med.daysLeft }).catch(() => {});
      }
    }

    return res.status(201).json({ medication: med });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

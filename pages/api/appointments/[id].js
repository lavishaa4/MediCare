// pages/api/appointments/[id].js
import { connectDB } from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  await connectDB();

  const { id } = req.query;
  const userId = decoded.userId;

  const apt = await Appointment.findOne({ _id: id, userId });
  if (!apt) return res.status(404).json({ error: 'Appointment not found' });

  if (req.method === 'PUT') {
    Object.assign(apt, req.body);
    await apt.save();
    return res.status(200).json({ appointment: apt });
  }

  if (req.method === 'DELETE') {
    apt.status = 'cancelled';
    await apt.save();
    return res.status(200).json({ message: 'Appointment cancelled' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

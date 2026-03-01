// pages/api/appointments/index.js
import { connectDB } from '../../../lib/mongodb';
import Appointment from '../../../models/Appointment';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  const decoded = await requireAuth(req, res);
  if (!decoded) return;
  await connectDB();

  const userId = decoded.userId;

  // GET — list appointments
  if (req.method === 'GET') {
    const appointments = await Appointment.find({ userId, status: { $ne: 'cancelled' } })
      .sort({ date: 1, time: 1 });
    return res.status(200).json({ appointments });
  }

  // POST — create appointment
  if (req.method === 'POST') {
    const { doctor, specialty, date, time, location, notes } = req.body;
    if (!doctor || !date || !time)
      return res.status(400).json({ error: 'Doctor, date and time are required' });

    const appointment = await Appointment.create({
      userId, doctor, specialty: specialty || '',
      date, time, location: location || '', notes: notes || '',
    });

    return res.status(201).json({ appointment });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

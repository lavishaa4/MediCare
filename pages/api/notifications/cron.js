// pages/api/notifications/cron.js
// This endpoint is called by Vercel Cron Jobs every hour.
// It checks for:
//   1. Medications due in the next hour → send reminder email
//   2. Medications with daysLeft < 10 → send low stock alert (once per day)
//   3. Appointments tomorrow → send reminder email (sent once)

import { connectDB } from '../../../lib/mongodb';
import Medication from '../../../models/Medication';
import Appointment from '../../../models/Appointment';
import Notification from '../../../models/Notification';
import User from '../../../models/User';
import {
  sendMedicationReminder,
  sendLowStockAlert,
  sendAppointmentReminder,
} from '../../../lib/mailer';

export default async function handler(req, res) {
  // Secure this endpoint with a secret header
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectDB();

  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  const todayStr = now.toISOString().split('T')[0];

  // Tomorrow's date string for appointment reminders
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  let emailsSent = 0;

  // ── 1. MEDICATION REMINDERS ───────────────────────────────────────────────
  const activeMeds = await Medication.find({ active: true }).lean();

  for (const med of activeMeds) {
    if (!med.times || med.times.length === 0) continue;

    // Check if any scheduled time matches current hour
    const isDue = med.times.some(t => {
      const [h] = t.split(':');
      return h === currentHour;
    });

    if (!isDue) continue;

    // Avoid duplicate notification in same hour
    const alreadyNotified = await Notification.findOne({
      userId: med.userId,
      type: 'reminder',
      relatedId: med._id,
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(currentHour), 0, 0) },
    });
    if (alreadyNotified) continue;

    const user = await User.findById(med.userId);
    if (!user) continue;

    // Create in-app notification
    await Notification.create({
      userId: med.userId,
      type: 'reminder',
      title: '💊 Medication Reminder',
      message: `Time to take ${med.name} ${med.dose} (${med.frequency})`,
      relatedId: med._id,
      relatedModel: 'Medication',
      emailSent: user.emailNotifications,
    });

    // Send email
    if (user.emailNotifications) {
      try {
        const dueTime = med.times.find(t => t.split(':')[0] === currentHour) || med.times[0];
        await sendMedicationReminder({
          to: user.email,
          name: user.name,
          medName: med.name,
          dose: med.dose,
          frequency: med.frequency,
          time: dueTime,
        });
        emailsSent++;
      } catch (err) {
        console.error('Medication email error:', err.message);
      }
    }
  }

  // ── 2. LOW STOCK ALERTS (once per day) ───────────────────────────────────
  const lowStockMeds = await Medication.find({ active: true, daysLeft: { $gt: 0, $lte: 9 } }).lean();

  for (const med of lowStockMeds) {
    const alreadyAlerted = await Notification.findOne({
      userId: med.userId,
      type: 'low_stock',
      relatedId: med._id,
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
      },
    });
    if (alreadyAlerted) continue;

    const user = await User.findById(med.userId);
    if (!user) continue;

    await Notification.create({
      userId: med.userId,
      type: 'low_stock',
      title: '⚠️ Low Medication Stock',
      message: `${med.name} has only ${med.daysLeft} day${med.daysLeft === 1 ? '' : 's'} of supply remaining. Please arrange a refill.`,
      relatedId: med._id,
      relatedModel: 'Medication',
      emailSent: user.emailNotifications,
    });

    if (user.emailNotifications) {
      try {
        await sendLowStockAlert({ to: user.email, name: user.name, medName: med.name, daysLeft: med.daysLeft });
        emailsSent++;
      } catch (err) {
        console.error('Low stock email error:', err.message);
      }
    }
  }

  // ── 3. APPOINTMENT REMINDERS (day before, sent once) ─────────────────────
  const tomorrowAppts = await Appointment.find({
    date: tomorrowStr,
    status: 'upcoming',
    reminderSent: false,
  }).lean();

  for (const apt of tomorrowAppts) {
    const user = await User.findById(apt.userId);
    if (!user) continue;

    await Notification.create({
      userId: apt.userId,
      type: 'appointment',
      title: '📅 Appointment Tomorrow',
      message: `Reminder: You have an appointment with ${apt.doctor} tomorrow at ${apt.time}${apt.location ? ` at ${apt.location}` : ''}.`,
      relatedId: apt._id,
      relatedModel: 'Appointment',
      emailSent: user.emailNotifications,
    });

    // Mark reminder sent to avoid duplicates
    await Appointment.findByIdAndUpdate(apt._id, { reminderSent: true });

    if (user.emailNotifications) {
      try {
        const dateFormatted = new Date(apt.date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });
        await sendAppointmentReminder({
          to: user.email,
          name: user.name,
          doctor: apt.doctor,
          specialty: apt.specialty,
          date: dateFormatted,
          time: apt.time,
          location: apt.location || 'See appointment details',
        });
        emailsSent++;
      } catch (err) {
        console.error('Appointment email error:', err.message);
      }
    }
  }

  return res.status(200).json({
    success: true,
    timestamp: now.toISOString(),
    emailsSent,
    medicationReminders: activeMeds.length,
    lowStockAlerts: lowStockMeds.length,
    appointmentReminders: tomorrowAppts.length,
  });
}

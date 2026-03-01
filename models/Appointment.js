// models/Appointment.js
import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  doctor: { type: String, required: true, trim: true },
  specialty: { type: String, default: '' },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  time: { type: String, required: true }, // "HH:MM"
  location: { type: String, default: '' },
  notes: { type: String, default: '' },
  reminderSent: { type: Boolean, default: false },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

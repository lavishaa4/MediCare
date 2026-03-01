// models/Medication.js
import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true }, // "Once daily", "Twice daily", etc.
  times: [{ type: String }], // e.g. ["08:00", "20:00"]
  condition: { type: String, default: '' },
  color: { type: String, default: '#3b6ef8' },
  totalDays: { type: Number, default: 30 },
  daysLeft: { type: Number, default: 30 },
  startDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  tutorialUrl: { type: String, default: '' },
  tutorialTitle: { type: String, default: '' },
  active: { type: Boolean, default: true },
  takenToday: { type: Boolean, default: false },
  lastTakenAt: { type: Date },
  adherenceLog: [{
    date: { type: String }, // "YYYY-MM-DD"
    taken: { type: Boolean, default: false },
  }],
}, { timestamps: true });

// Compute adherence %
MedicationSchema.virtual('adherence').get(function () {
  if (!this.adherenceLog.length) return 100;
  const taken = this.adherenceLog.filter(l => l.taken).length;
  return Math.round((taken / this.adherenceLog.length) * 100);
});

MedicationSchema.set('toJSON', { virtuals: true });
MedicationSchema.set('toObject', { virtuals: true });

export default mongoose.models.Medication || mongoose.model('Medication', MedicationSchema);

// models/Notification.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['reminder', 'low_stock', 'appointment', 'success', 'info'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // medication or appointment id
  relatedModel: { type: String }, // 'Medication' | 'Appointment'
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

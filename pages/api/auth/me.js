// pages/api/auth/me.js
import { connectDB } from '../../../lib/mongodb';
import User from '../../../models/User';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const decoded = await requireAuth(req, res);
  if (!decoded) return;

  await connectDB();
  const user = await User.findById(decoded.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.status(200).json({ user: user.toSafeObject() });
}

// pages/index.js
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

// ─── ICON ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = 'currentColor' }) => {
  const paths = {
    dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    medications: 'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.49 0 4.5-2.01 4.5-4.5S18.49 2 16 2s-4.5 2.01-4.5 4.5S13.51 11 16 11zm-1-6.5v4h2v-4h-2z',
    appointments: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2zm-8 4H7v2h2zm4 0h-2v2h2zm4 0h-2v2h2z',
    family: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    tutorials: 'M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.25 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    eyeoff: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    play: 'M8 5v14l11-7z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    logout: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
    trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={paths[name] || paths.info} />
    </svg>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <span style={s.modalTitle}>{title}</span>
          <button onClick={onClose} style={s.iconBtn}><Icon name="close" size={20} color="#64748b" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── FIELD ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid #e2e8f0', fontSize: 14,
  fontFamily: 'inherit', color: '#0f172a', background: '#fff', outline: 'none',
};

// ─── ADD MEDICATION MODAL ─────────────────────────────────────────────────────
function AddMedicationModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', dose: '', frequency: 'Once daily',
    times: ['08:00'], condition: '', color: '#3b6ef8',
    totalDays: 30, notes: '', tutorialUrl: '', tutorialTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const COLORS = ['#3b6ef8','#22c55e','#f59e0b','#8b5cf6','#ef4444','#0ea5e9','#ec4899'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.dose) return setError('Name and dose are required');
    setLoading(true);
    try {
      const { medication } = await api.medications.create(form);
      onSave(medication);
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="➕ Add Medication" onClose={onClose}>
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.formGrid}>
          <Field label="Medication Name *">
            <input style={inp} placeholder="e.g. Metformin" value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Dose *">
            <input style={inp} placeholder="e.g. 500mg" value={form.dose} onChange={e => set('dose', e.target.value)} />
          </Field>
          <Field label="Frequency *">
            <select style={inp} value={form.frequency} onChange={e => set('frequency', e.target.value)}>
              {['Once daily','Twice daily','Three times daily','As needed','Weekly'].map(f => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Condition / Reason">
            <input style={inp} placeholder="e.g. Hypertension" value={form.condition} onChange={e => set('condition', e.target.value)} />
          </Field>
          <Field label="Reminder Time(s)">
            <input style={inp} type="time" value={form.times[0]} onChange={e => set('times', [e.target.value])} />
          </Field>
          <Field label="Days Supply">
            <input style={inp} type="number" min={1} max={365} value={form.totalDays} onChange={e => set('totalDays', parseInt(e.target.value))} />
          </Field>
        </div>
        <Field label="Color Tag">
          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => set('color', c)}
                style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #0f172a' : '2px solid transparent', cursor: 'pointer' }} />
            ))}
          </div>
        </Field>
        <Field label="YouTube Tutorial URL (optional)">
          <input style={inp} placeholder="https://youtube.com/watch?v=..." value={form.tutorialUrl} onChange={e => set('tutorialUrl', e.target.value)} />
        </Field>
        <Field label="Tutorial Title">
          <input style={inp} placeholder="e.g. How to use a blood pressure monitor" value={form.tutorialTitle} onChange={e => set('tutorialTitle', e.target.value)} />
        </Field>
        <Field label="Notes">
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 70 }} placeholder="Take with food..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </Field>
        {error && <div style={s.errorBox}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Save Medication'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── ADD APPOINTMENT MODAL ────────────────────────────────────────────────────
function AddAppointmentModal({ onClose, onSave }) {
  const [form, setForm] = useState({ doctor: '', specialty: '', date: '', time: '', location: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.date || !form.time) return setError('Doctor, date and time are required');
    setLoading(true);
    try {
      const { appointment } = await api.appointments.create(form);
      onSave(appointment);
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="📅 Add Appointment" onClose={onClose}>
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.formGrid}>
          <Field label="Doctor Name *">
            <input style={inp} placeholder="Dr. Priya Sharma" value={form.doctor} onChange={e => set('doctor', e.target.value)} />
          </Field>
          <Field label="Specialty">
            <input style={inp} placeholder="Cardiologist" value={form.specialty} onChange={e => set('specialty', e.target.value)} />
          </Field>
          <Field label="Date *">
            <input style={inp} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </Field>
          <Field label="Time *">
            <input style={inp} type="time" value={form.time} onChange={e => set('time', e.target.value)} />
          </Field>
        </div>
        <Field label="Location / Clinic">
          <input style={inp} placeholder="Apollo Medical Centre, Mumbai" value={form.location} onChange={e => set('location', e.target.value)} />
        </Field>
        <Field label="Notes">
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 70 }} placeholder="Bring insurance card..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </Field>
        {error && <div style={s.errorBox}>{error}</div>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Save Appointment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Full name is required');
      if (!form.email.includes('@')) return setError('Enter a valid email');
      if (form.password.length < 6) return setError('Password must be at least 6 characters');
      if (form.password !== form.confirm) return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      const fn = mode === 'login' ? api.auth.login : api.auth.register;
      const { token, user } = await fn({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('medicare_token', token);
      onLogin(user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={auth.root}>
      {/* Left */}
      <div style={auth.left}>
        <div style={auth.leftInner}>
          <div style={auth.brand}>
            <div style={auth.brandIcon}>
              <Icon name="medications" size={22} color="#fff" />
            </div>
            <div>
              <div style={auth.brandName}>MediCare</div>
              <div style={auth.brandSub}>Your Health Assistant</div>
            </div>
          </div>
          <h1 style={auth.hero}>Your health,<br /><span style={auth.heroAccent}>always on track.</span></h1>
          <p style={auth.heroDesc}>Smart medication reminders, appointment tracking, device tutorials, and family health — all in one place.</p>
          <div style={auth.features}>
            {['Email reminders at medication time','Low stock alerts before you run out','Appointment reminders sent the day before','YouTube tutorials for your medical devices'].map(f => (
              <div key={f} style={auth.feature}><div style={auth.dot} /><span>{f}</span></div>
            ))}
          </div>
        </div>
      </div>
      {/* Right */}
      <div style={auth.right}>
        <div style={auth.card}>
          <div style={auth.tabs}>
            {['login','signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{ ...auth.tab, ...(mode === m ? auth.tabActive : {}) }}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>
          <h2 style={auth.formTitle}>{mode === 'login' ? 'Welcome back 👋' : 'Create your account'}</h2>
          <p style={auth.formSub}>{mode === 'login' ? 'Sign in to manage your health' : 'Start your health journey today'}</p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <Field label="Full Name">
                <input style={inp} placeholder="Lavisha Valecha" value={form.name} onChange={e => set('name', e.target.value)} />
              </Field>
            )}
            <Field label="Email Address">
              <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </Field>
            <Field label="Password">
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp, paddingRight: 42 }} type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={auth.eyeBtn}>
                  <Icon name={showPass ? 'eyeoff' : 'eye'} size={16} color="#94a3b8" />
                </button>
              </div>
            </Field>
            {mode === 'signup' && (
              <Field label="Confirm Password">
                <input style={inp} type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
              </Field>
            )}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -8 }}>
                <a href="#" style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}>Forgot password?</a>
              </div>
            )}
            {error && <div style={s.errorBox}>{error}</div>}
            <button type="submit" style={auth.submitBtn} disabled={loading}>
              {loading ? <span className="spinner" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ background: 'none', color: '#2563eb', fontWeight: 700, fontSize: 14 }}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [meds, setMeds] = useState([]);
  const [apts, setApts] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddApt, setShowAddApt] = useState(false);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [loadingApts, setLoadingApts] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const loadMeds = useCallback(async () => {
    try { const d = await api.medications.list(); setMeds(d.medications || []); } catch {}
    finally { setLoadingMeds(false); }
  }, []);

  const loadApts = useCallback(async () => {
    try { const d = await api.appointments.list(); setApts(d.appointments || []); } catch {}
    finally { setLoadingApts(false); }
  }, []);

  const loadNotifs = useCallback(async () => {
    try {
      const d = await api.notifications.list();
      setNotifs(d.notifications || []);
      setUnread(d.unreadCount || 0);
    } catch {}
  }, []);

  useEffect(() => { loadMeds(); loadApts(); loadNotifs(); }, []);

  // Poll notifications every 60s
  useEffect(() => { const t = setInterval(loadNotifs, 60000); return () => clearInterval(t); }, []);

  const markTaken = async (id) => {
    try {
      const { medication } = await api.medications.markTaken(id);
      setMeds(prev => prev.map(m => m._id === id ? medication : m));
    } catch {}
  };

  const deleteMed = async (id) => {
    if (!confirm('Remove this medication?')) return;
    try { await api.medications.delete(id); setMeds(prev => prev.filter(m => m._id !== id)); } catch {}
  };

  const cancelApt = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await api.appointments.cancel(id); setApts(prev => prev.filter(a => a._id !== id)); } catch {}
  };

  const openNotifs = async () => {
    setShowNotif(!showNotif);
    if (!showNotif && unread > 0) {
      await api.notifications.markAllRead().catch(() => {});
      setUnread(0);
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const today = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'medications', icon: 'medications', label: 'Medications' },
    { id: 'appointments', icon: 'appointments', label: 'Appointments' },
    { id: 'family', icon: 'family', label: 'Family' },
    { id: 'tutorials', icon: 'tutorials', label: 'Tutorials' },
    { id: 'purchase', icon: 'cart', label: 'Purchase' },
    { id: 'donate', icon: 'heart', label: 'Donate' },
  ];

  const notifColor = { reminder: '#3b6ef8', low_stock: '#ef4444', appointment: '#22c55e', success: '#10b981', info: '#8b5cf6' };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = apts.filter(a => a.date === todayStr);

  return (
    <div style={{ minHeight: '100vh', background: '#eef2f8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Topbar */}
      <header style={db.topbar}>
        <div style={db.topLogo}>
          <div style={db.topLogoIcon}><Icon name="medications" size={18} color="#fff" /></div>
          <div>
            <div style={db.topLogoText}>MediCare</div>
            <div style={db.topLogoSub}>Your Health Assistant</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button style={db.iconBtn} onClick={openNotifs}>
              <Icon name="bell" size={20} color="#374151" />
              {unread > 0 && <span style={db.badge}>{unread > 9 ? '9+' : unread}</span>}
            </button>
            {showNotif && (
              <div style={db.notifPanel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 4px 12px', borderBottom: '1px solid #f0f4f8', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Notifications</span>
                  <button style={s.iconBtn} onClick={() => setShowNotif(false)}><Icon name="close" size={16} color="#94a3b8" /></button>
                </div>
                {notifs.length === 0 && <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No notifications yet</p>}
                {notifs.map(n => (
                  <div key={n._id} style={{ ...db.notifItem, borderLeft: `3px solid ${notifColor[n.type] || '#3b6ef8'}`, opacity: n.read ? 0.7 : 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
                <div style={{ padding: '10px 0 2px', textAlign: 'center', borderTop: '1px solid #f0f4f8', marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: '#3b6ef8', fontWeight: 600 }}>📧 Email notifications are ON</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.email}</div>
          </div>
          <button onClick={onLogout} style={db.logoutBtn}><Icon name="logout" size={15} color="#374151" />Logout</button>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={db.sidebar}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ ...db.navBtn, ...(tab === item.id ? db.navBtnActive : {}) }}>
              <Icon name={item.icon} size={18} color={tab === item.id ? '#fff' : '#374151'} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '32px 36px', minHeight: 'calc(100vh - 64px)' }} className="fade" key={tab}>

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div>
              <div style={db.pageTitle}>Daily Schedule</div>
              <div style={db.pageDate}>{today}</div>
              <div style={db.statRow}>
                <div style={db.statCard}>
                  <div style={db.statTop}><span style={db.statLabel}>Medications Today</span><Icon name="medications" size={22} color="#3b6ef8" /></div>
                  <div style={db.statNum}>{meds.length}</div>
                  <div style={db.statSub}>Active prescriptions</div>
                </div>
                <div style={db.statCard}>
                  <div style={db.statTop}><span style={db.statLabel}>Appointments</span><Icon name="appointments" size={22} color="#22c55e" /></div>
                  <div style={db.statNum}>{apts.length}</div>
                  <div style={db.statSub}>Upcoming</div>
                </div>
                <div style={db.statCard}>
                  <div style={db.statTop}><span style={db.statLabel}>Health Score</span><Icon name="heart" size={22} color="#ef4444" /></div>
                  <div style={{ ...db.statNum, color: '#22c55e' }}>Good</div>
                  <div style={db.statSub}>Keep it up!</div>
                </div>
              </div>

              <div style={db.panelRow}>
                {/* Today's Meds */}
                <div style={db.panel}>
                  <div style={db.panelTitle}>Today's Medications</div>
                  <div style={db.panelSub}>Your medication schedule for today</div>
                  {loadingMeds ? <Loader /> : meds.length === 0 ? <Empty msg="No medications scheduled" /> : (
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {meds.slice(0, 4).map(m => (
                        <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{m.name} <span style={{ color: '#64748b', fontWeight: 400 }}>{m.dose}</span></div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{m.frequency} {m.times?.[0] && `· ${m.times[0]}`}</div>
                          </div>
                          <button onClick={() => markTaken(m._id)}
                            style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 7, border: m.takenToday ? '1px solid #bbf7d0' : '1px solid #e2e8f0', background: m.takenToday ? '#dcfce7' : '#f8faff', color: m.takenToday ? '#16a34a' : '#374151' }}>
                            {m.takenToday ? '✓ Taken' : 'Take'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Today's Apts */}
                <div style={db.panel}>
                  <div style={db.panelTitle}>Today's Appointments</div>
                  <div style={db.panelSub}>Your appointments for today</div>
                  {loadingApts ? <Loader /> : todayApts.length === 0 ? <Empty msg="No appointments today" /> : (
                    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {todayApts.map(a => (
                        <div key={a._id} style={{ display: 'flex', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon name="appointments" size={18} color="#3b6ef8" />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{a.doctor}</div>
                            <div style={{ fontSize: 12, color: '#3b6ef8', fontWeight: 500 }}>{a.specialty}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* How notifications work */}
              <div style={{ ...db.panel, background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>📧 How Email Notifications Work</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 12 }}>
                  {[
                    { icon: '💊', title: 'Medication Reminder', desc: `An email is sent to ${user.email} at the exact time you scheduled each medication.` },
                    { icon: '⚠️', title: 'Low Stock Alert', desc: 'When any medication has less than 10 days remaining, you get an alert once per day.' },
                    { icon: '📅', title: 'Appointment Reminder', desc: 'The day before any appointment, you receive an email with all the details.' },
                  ].map(item => (
                    <div key={item.title} style={{ background: '#fff', borderRadius: 10, padding: 16, border: '1px solid #e8eef8' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MEDICATIONS ── */}
          {tab === 'medications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={db.pageTitle}>Medications</div>
                  <div style={db.pageDate}>Manage your prescriptions</div>
                </div>
                <button style={db.addBtn} onClick={() => setShowAddMed(true)}>
                  <Icon name="plus" size={18} color="#fff" /> Add Medication
                </button>
              </div>
              {loadingMeds ? <Loader /> : meds.length === 0 ? (
                <div style={{ ...db.panel, textAlign: 'center', padding: 56 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No medications yet</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>Add your first prescription to start tracking</div>
                  <button style={db.addBtn} onClick={() => setShowAddMed(true)}><Icon name="plus" size={16} color="#fff" /> Add Medication</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {meds.map(m => (
                    <div key={m._id} style={{ ...db.panel, display: 'flex', padding: 0, overflow: 'hidden' }}>
                      <div style={{ width: 6, background: m.color, flexShrink: 0 }} />
                      <div style={{ padding: '18px 22px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{m.dose} · {m.frequency}{m.condition ? ` · ${m.condition}` : ''}</div>
                            {m.times?.length > 0 && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>⏰ {m.times.join(', ')}</div>}
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {m.daysLeft < 10 && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '3px 10px', borderRadius: 20 }}>
                                ⚠ {m.daysLeft}d left
                              </span>
                            )}
                            <button onClick={() => deleteMed(m._id)} style={{ ...s.iconBtn, color: '#ef4444' }}>
                              <Icon name="trash" size={16} color="#ef4444" />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                          <button onClick={() => markTaken(m._id)}
                            style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', background: m.takenToday ? '#dcfce7' : m.color, color: m.takenToday ? '#16a34a' : '#fff' }}>
                            {m.takenToday ? '✓ Taken today' : 'Mark as Taken'}
                          </button>
                          {m.tutorialUrl && (
                            <a href={m.tutorialUrl} target="_blank" rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#f8faff', border: '1px solid #e2e8f0', fontSize: 13, fontWeight: 600, color: '#374151' }}>
                              <Icon name="play" size={14} color="#374151" />
                              {m.tutorialTitle || 'Watch Tutorial'}
                            </a>
                          )}
                        </div>
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 5 }}>Adherence: {m.adherence ?? 100}%</div>
                          <div style={{ height: 5, background: '#f0f4f8', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${m.adherence ?? 100}%`, background: m.color, borderRadius: 3 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {showAddMed && <AddMedicationModal onClose={() => setShowAddMed(false)} onSave={med => setMeds(prev => [med, ...prev])} />}
            </div>
          )}

          {/* ── APPOINTMENTS ── */}
          {tab === 'appointments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={db.pageTitle}>Appointments</div>
                  <div style={db.pageDate}>Upcoming medical appointments</div>
                </div>
                <button style={db.addBtn} onClick={() => setShowAddApt(true)}>
                  <Icon name="plus" size={18} color="#fff" /> Add Appointment
                </button>
              </div>
              {loadingApts ? <Loader /> : apts.length === 0 ? (
                <div style={{ ...db.panel, textAlign: 'center', padding: 56 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No appointments yet</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>Schedule your first appointment</div>
                  <button style={db.addBtn} onClick={() => setShowAddApt(true)}><Icon name="plus" size={16} color="#fff" /> Add Appointment</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {apts.map(a => {
                    const dateObj = new Date(a.date + 'T00:00:00');
                    const formatted = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                    const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));
                    return (
                      <div key={a._id} style={{ ...db.panel, display: 'flex', gap: 18, alignItems: 'center', opacity: isPast ? 0.65 : 1 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon name="appointments" size={24} color="#3b6ef8" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{a.doctor}</div>
                          {a.specialty && <div style={{ fontSize: 13, color: '#3b6ef8', fontWeight: 600, marginTop: 1 }}>{a.specialty}</div>}
                          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                            {formatted} · {a.time} {a.location && `· ${a.location}`}
                          </div>
                          {a.notes && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{a.notes}</div>}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {isPast
                            ? <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', background: '#f0f4f8', padding: '5px 12px', borderRadius: 7 }}>Past</span>
                            : <><div style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', background: '#f0fdf4', padding: '5px 12px', borderRadius: 7, border: '1px solid #bbf7d0' }}>📧 Reminder set</div>
                               <button onClick={() => cancelApt(a._id)} style={{ ...s.iconBtn, padding: '6px 10px', background: '#fef2f2', borderRadius: 7, border: '1px solid #fecaca' }}>
                                 <Icon name="trash" size={16} color="#ef4444" />
                               </button></>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {showAddApt && <AddAppointmentModal onClose={() => setShowAddApt(false)} onSave={apt => setApts(prev => [...prev, apt].sort((a,b) => a.date.localeCompare(b.date)))} />}
            </div>
          )}

          {/* ── FAMILY ── */}
          {tab === 'family' && (
            <div>
              <div style={db.pageTitle}>Family Health</div>
              <div style={db.pageDate}>Monitor your family members' health profiles</div>
              <div style={{ marginTop: 24, ...db.panel, textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>👨‍👩‍👧</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Family profiles coming soon</div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>Add family members to track their medications and appointments</div>
                <button style={{ ...db.addBtn, marginTop: 20 }}>
                  <Icon name="plus" size={16} color="#fff" /> Add Family Member
                </button>
              </div>
            </div>
          )}

          {/* ── TUTORIALS ── */}
          {tab === 'tutorials' && (
            <div>
              <div style={db.pageTitle}>Tutorials</div>
              <div style={db.pageDate}>How to use your medical devices</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                {[
                  { title: 'How to Use a Blood Pressure Monitor', cat: 'Hypertension', url: 'https://www.youtube.com/watch?v=JFh6in0YLNQ', vid: 'JFh6in0YLNQ', dur: '6:14' },
                  { title: 'Blood Glucose Monitoring at Home', cat: 'Diabetes', url: 'https://www.youtube.com/watch?v=nPxS_rV2aow', vid: 'nPxS_rV2aow', dur: '4:32' },
                  { title: 'Proper Inhaler Technique', cat: 'Asthma', url: 'https://www.youtube.com/watch?v=R5QSRreRHxs', vid: 'R5QSRreRHxs', dur: '3:21' },
                  { title: 'How to Check Your Pulse', cat: 'General', url: 'https://www.youtube.com/watch?v=Yv5DnKpI-_k', vid: 'Yv5DnKpI-_k', dur: '2:58' },
                ].map(t => (
                  <div key={t.vid} style={db.panel}>
                    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#f0f4f8', marginBottom: 14 }}>
                      <img src={`https://img.youtube.com/vi/${t.vid}/mqdefault.jpg`} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display = 'none'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#3b6ef8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="play" size={20} color="#fff" />
                        </div>
                      </div>
                      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>{t.dur}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#3b6ef8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{t.cat}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12, lineHeight: 1.4 }}>{t.title}</div>
                    <a href={t.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#3b6ef8', color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 8 }}>
                      <Icon name="play" size={14} color="#fff" /> Watch on YouTube
                    </a>
                  </div>
                ))}
              </div>
              {meds.filter(m => m.tutorialUrl).length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Your Medication Tutorials</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {meds.filter(m => m.tutorialUrl).map(m => (
                      <div key={m._id} style={{ ...db.panel, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 8, alignSelf: 'stretch', background: m.color, borderRadius: 4, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{m.name}</div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>{m.tutorialTitle || 'Custom Tutorial'}</div>
                        </div>
                        <a href={m.tutorialUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#3b6ef8', color: '#fff', fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 8 }}>
                          <Icon name="play" size={14} color="#fff" /> Watch
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── PURCHASE ── */}
          {tab === 'purchase' && (
            <div>
              <div style={db.pageTitle}>Purchase</div>
              <div style={db.pageDate}>Order medication refills</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                {meds.map(m => (
                  <div key={m._id} style={{ ...db.panel, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${m.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="medications" size={22} color={m.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.name} {m.dose}</div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{m.condition || m.frequency} · {m.daysLeft} days remaining</div>
                    </div>
                    {m.daysLeft < 10 && <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '3px 10px', borderRadius: 20 }}>Low stock</span>}
                    <button style={{ background: '#3b6ef8', color: '#fff', padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13 }}>Order Refill</button>
                  </div>
                ))}
                {meds.length === 0 && <div style={{ ...db.panel, textAlign: 'center', padding: 48, color: '#94a3b8' }}>Add medications first to order refills</div>}
              </div>
            </div>
          )}

          {/* ── DONATE ── */}
          {tab === 'donate' && (
            <div>
              <div style={db.pageTitle}>Donate</div>
              <div style={db.pageDate}>Support healthcare access for everyone</div>
              <div style={{ ...db.panel, marginTop: 24, textAlign: 'center', padding: '56px 48px' }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>❤️</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>Make a Difference</div>
                <div style={{ fontSize: 15, color: '#64748b', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7 }}>
                  Your donation helps provide medication reminders and health tools to underserved communities who cannot afford healthcare management tools.
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                  {['₹100','₹500','₹1,000','₹5,000'].map(amt => (
                    <button key={amt} style={{ padding: '10px 24px', borderRadius: 10, border: '2px solid #3b6ef8', background: 'transparent', color: '#3b6ef8', fontWeight: 700, fontSize: 15 }}>{amt}</button>
                  ))}
                </div>
                <button style={{ ...db.addBtn, fontSize: 16, padding: '13px 48px' }}>Donate Now</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

function Loader() {
  return <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
    <div style={{ display: 'inline-block', width: 24, height: 24, border: '2px solid #e2e8f0', borderTopColor: '#3b6ef8', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>;
}

function Empty({ msg }) {
  return <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>{msg}</div>;
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('medicare_token');
    if (!token) { setChecking(false); return; }
    api.auth.me().then(({ user }) => setUser(user)).catch(() => localStorage.removeItem('medicare_token')).finally(() => setChecking(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medicare_token');
    setUser(null);
  };

  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2f8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#3b6ef8', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <div style={{ marginTop: 12, color: '#64748b', fontSize: 14 }}>Loading MediCare...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  return user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthPage onLogin={setUser} />;
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 },
  modal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 16px', borderBottom: '1px solid #f0f4f8' },
  modalTitle: { fontSize: 17, fontWeight: 800, color: '#0f172a' },
  form: { padding: 24, display: 'flex', flexDirection: 'column', gap: 16 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', fontWeight: 500 },
  cancelBtn: { padding: '10px 20px', borderRadius: 9, background: '#f0f4f8', color: '#374151', fontWeight: 600, fontSize: 14 },
  submitBtn: { padding: '11px 24px', borderRadius: 9, background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  iconBtn: { background: 'transparent', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, cursor: 'pointer' },
};

const auth = {
  root: { display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  left: { flex: 1, background: 'linear-gradient(145deg,#1e3a8a 0%,#2563eb 60%,#3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' },
  leftInner: { maxWidth: 420, animation: 'fadeUp 0.5s ease' },
  brand: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 },
  brandIcon: { width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' },
  brandName: { fontSize: 22, fontWeight: 800, color: '#fff' },
  brandSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  hero: { fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-1px', marginBottom: 16 },
  heroAccent: { color: '#93c5fd' },
  heroDesc: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 },
  features: { display: 'flex', flexDirection: 'column', gap: 10 },
  feature: { display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#93c5fd', flexShrink: 0 },
  right: { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#f8faff' },
  card: { width: '100%', maxWidth: 400, animation: 'fadeUp 0.5s ease 0.1s both' },
  tabs: { display: 'flex', background: '#e8eef8', borderRadius: 10, padding: 4, marginBottom: 28 },
  tab: { flex: 1, padding: '9px 0', borderRadius: 8, background: 'transparent', fontSize: 14, fontWeight: 600, color: '#64748b', cursor: 'pointer' },
  tabActive: { background: '#fff', color: '#1e40af', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  formTitle: { fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 },
  formSub: { fontSize: 14, color: '#64748b', marginBottom: 24 },
  eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 },
  submitBtn: { width: '100%', padding: '13px 0', borderRadius: 10, background: 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
};

const db = {
  topbar: { background: '#fff', borderBottom: '1px solid #e8eef8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 64, position: 'sticky', top: 0, zIndex: 50 },
  topLogo: { display: 'flex', alignItems: 'center', gap: 10 },
  topLogoIcon: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  topLogoText: { fontSize: 18, fontWeight: 800, color: '#3b6ef8' },
  topLogoSub: { fontSize: 11, color: '#94a3b8' },
  iconBtn: { position: 'relative', width: 38, height: 38, borderRadius: 10, background: '#f8faff', border: '1px solid #e8eef8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  badge: { position: 'absolute', top: -4, right: -4, width: 17, height: 17, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#f8faff', border: '1px solid #e8eef8', fontSize: 13, fontWeight: 600, color: '#374151' },
  notifPanel: { position: 'absolute', top: 46, right: 0, width: 360, background: '#fff', border: '1px solid #e8eef8', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: 14, zIndex: 100, maxHeight: 500, overflow: 'auto', animation: 'slideIn 0.2s ease' },
  notifItem: { padding: '10px 12px', borderRadius: 8, marginBottom: 6, background: '#f8faff' },
  sidebar: { width: 200, background: '#fff', borderRight: '1px solid #e8eef8', minHeight: 'calc(100vh - 64px)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 64, alignSelf: 'flex-start', height: 'calc(100vh - 64px)' },
  navBtn: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: 'transparent', color: '#374151', fontSize: 14, fontWeight: 500, width: '100%', textAlign: 'left' },
  navBtnActive: { background: '#1e40af', color: '#fff', fontWeight: 700 },
  addBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', color: '#fff', fontWeight: 700, fontSize: 14 },
  pageTitle: { fontSize: 30, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' },
  pageDate: { fontSize: 14, color: '#94a3b8', marginTop: 4, marginBottom: 0 },
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, margin: '24px 0' },
  statCard: { background: '#fff', borderRadius: 14, padding: 22, border: '1px solid #e8eef8' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: 500 },
  statNum: { fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' },
  statSub: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  panelRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  panel: { background: '#fff', borderRadius: 14, padding: 22, border: '1px solid #e8eef8' },
  panelTitle: { fontSize: 15, fontWeight: 700, color: '#0f172a' },
  panelSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
};

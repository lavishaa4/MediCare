// lib/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function baseTemplate(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { margin:0; padding:0; background:#eef2f8; font-family:'Segoe UI',Arial,sans-serif; }
      .wrap { max-width:560px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
      .header { background:linear-gradient(135deg,#1e40af,#3b82f6); padding:28px 32px; }
      .logo { font-size:22px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
      .logo span { opacity:0.7; font-size:13px; font-weight:400; display:block; margin-top:2px; }
      .body { padding:32px; }
      .title { font-size:20px; font-weight:700; color:#0f172a; margin-bottom:8px; }
      .text { font-size:14px; color:#475569; line-height:1.7; margin-bottom:20px; }
      .card { background:#f0f4f8; border-radius:10px; padding:16px 20px; margin:16px 0; }
      .card-label { font-size:11px; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; }
      .card-value { font-size:16px; font-weight:700; color:#0f172a; }
      .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; }
      .badge-red { background:#fef2f2; color:#ef4444; }
      .badge-blue { background:#eff6ff; color:#3b6ef8; }
      .badge-green { background:#f0fdf4; color:#16a34a; }
      .btn { display:inline-block; background:linear-gradient(135deg,#1e40af,#3b82f6); color:#fff !important; text-decoration:none; padding:12px 28px; border-radius:10px; font-size:14px; font-weight:700; margin-top:8px; }
      .footer { background:#f8faff; padding:20px 32px; border-top:1px solid #e8eef8; font-size:12px; color:#94a3b8; text-align:center; }
      .divider { height:1px; background:#e8eef8; margin:20px 0; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="header">
        <div class="logo">MediCare <span>Your Health Assistant</span></div>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        MediCare &mdash; Smart Healthcare Assistant<br/>
        You're receiving this because you enabled email notifications.
      </div>
    </div>
  </body>
  </html>`;
}

export async function sendMedicationReminder({ to, name, medName, dose, frequency, time }) {
  const html = baseTemplate(`
    <div class="title">💊 Medication Reminder</div>
    <p class="text">Hi ${name}, it's time to take your medication.</p>
    <div class="card">
      <div class="card-label">Medication</div>
      <div class="card-value">${medName}</div>
    </div>
    <div class="card">
      <div class="card-label">Dosage</div>
      <div class="card-value">${dose}</div>
    </div>
    <div class="card">
      <div class="card-label">Frequency</div>
      <div class="card-value">${frequency}</div>
    </div>
    <div class="card">
      <div class="card-label">Scheduled Time</div>
      <div class="card-value">${time}</div>
    </div>
    <div class="divider"></div>
    <p class="text">Please take your medication as prescribed. Consistent adherence leads to better health outcomes.</p>
    <a href="${BASE_URL}" class="btn">Open MediCare →</a>
  `);

  return transporter.sendMail({
    from: `"MediCare" <${process.env.GMAIL_USER}>`,
    to,
    subject: `💊 Reminder: Take your ${medName} now`,
    html,
  });
}

export async function sendLowStockAlert({ to, name, medName, daysLeft }) {
  const html = baseTemplate(`
    <div class="title">⚠️ Low Medication Stock Alert</div>
    <p class="text">Hi ${name}, you're running low on one of your medications.</p>
    <div class="card">
      <div class="card-label">Medication</div>
      <div class="card-value">${medName} &nbsp;<span class="badge badge-red">Only ${daysLeft} days left</span></div>
    </div>
    <div class="divider"></div>
    <p class="text">Please arrange a refill soon to avoid missing doses. You can order directly from the Purchase section in MediCare.</p>
    <a href="${BASE_URL}" class="btn">Order Refill →</a>
  `);

  return transporter.sendMail({
    from: `"MediCare" <${process.env.GMAIL_USER}>`,
    to,
    subject: `⚠️ Refill needed: ${medName} — ${daysLeft} days remaining`,
    html,
  });
}

export async function sendAppointmentReminder({ to, name, doctor, specialty, date, time, location }) {
  const html = baseTemplate(`
    <div class="title">📅 Appointment Tomorrow</div>
    <p class="text">Hi ${name}, you have a medical appointment tomorrow. Here are the details:</p>
    <div class="card">
      <div class="card-label">Doctor</div>
      <div class="card-value">${doctor} &nbsp;<span class="badge badge-blue">${specialty}</span></div>
    </div>
    <div class="card">
      <div class="card-label">Date &amp; Time</div>
      <div class="card-value">${date} at ${time}</div>
    </div>
    <div class="card">
      <div class="card-label">Location</div>
      <div class="card-value">${location}</div>
    </div>
    <div class="divider"></div>
    <p class="text">Make sure to bring any relevant medical records, your medication list, and insurance card.</p>
    <a href="${BASE_URL}" class="btn">View Appointments →</a>
  `);

  return transporter.sendMail({
    from: `"MediCare" <${process.env.GMAIL_USER}>`,
    to,
    subject: `📅 Reminder: Appointment with ${doctor} tomorrow`,
    html,
  });
}

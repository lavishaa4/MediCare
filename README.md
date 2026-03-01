# MediCare — Full Stack Healthcare Assistant

Built with **Next.js · MongoDB Atlas · Nodemailer · Vercel Cron Jobs**

---

## 🏗 Project Structure

```
medicare/
├── pages/
│   ├── index.js                    # Full frontend (auth + dashboard)
│   ├── _app.js
│   └── api/
│       ├── auth/
│       │   ├── register.js         # POST /api/auth/register
│       │   ├── login.js            # POST /api/auth/login
│       │   └── me.js               # GET  /api/auth/me
│       ├── medications/
│       │   ├── index.js            # GET / POST /api/medications
│       │   └── [id].js             # PUT / DELETE /api/medications/:id
│       ├── appointments/
│       │   ├── index.js            # GET / POST /api/appointments
│       │   └── [id].js             # PUT / DELETE /api/appointments/:id
│       └── notifications/
│           ├── index.js            # GET / PATCH /api/notifications
│           └── cron.js             # Called by Vercel Cron every hour
├── models/
│   ├── User.js
│   ├── Medication.js
│   ├── Appointment.js
│   └── Notification.js
├── lib/
│   ├── mongodb.js                  # DB connection with caching
│   ├── auth.js                     # JWT sign/verify
│   ├── mailer.js                   # Nodemailer email templates
│   └── api.js                      # Frontend API client
├── styles/
│   └── globals.css
├── vercel.json                     # Cron job config (runs hourly)
├── .env.local.example              # Environment variable template
└── README.md
```

---

## ⚡ Local Setup

### 1. Clone & install
```bash
git clone <your-repo>
cd medicare
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/medicare
JWT_SECRET=some-long-random-secret-string
GMAIL_USER=yourgmail@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Google App Password (not your real password)
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-cron-secret-key
```

### 3. Get a Gmail App Password
1. Go to **Google Account → Security → 2-Step Verification → App Passwords**
2. Generate a password for "Mail"
3. Paste it in `GMAIL_APP_PASSWORD`

### 4. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

---

## 🚀 Deploy to Vercel + MongoDB Atlas

### MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → Create free cluster
2. Create database user → Get connection string
3. Add your Vercel IP (or allow all: `0.0.0.0/0`) to Network Access

### Vercel
1. Push your code to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` → set to your Vercel URL (e.g. `https://medicare.vercel.app`)
   - `CRON_SECRET` → a secret string you choose
4. Deploy!

---

## 📧 How Email Notifications Work

Notifications are powered by **Vercel Cron Jobs** + **Nodemailer (Gmail SMTP)**.

```
vercel.json schedules:  /api/notifications/cron  →  runs every hour (0 * * * *)
```

### What the cron job does (every hour):

| Trigger | When | Email sent |
|---------|------|-----------|
| 💊 **Medication Reminder** | Matches medication's scheduled time | "Time to take [Med] [Dose]" |
| ⚠️ **Low Stock Alert** | Medication has < 10 days left | "Refill needed: [Med] — X days remaining" |
| 📅 **Appointment Reminder** | Day before appointment | "Appointment with [Doctor] tomorrow at [Time]" |

### Flow diagram:
```
User adds medication with time "08:00"
         ↓
Vercel Cron runs at 8 AM UTC
         ↓
cron.js checks: any meds scheduled for hour 8?  →  YES
         ↓
Creates Notification in MongoDB (in-app bell)
         ↓
Sends email via Nodemailer → User's inbox
```

### In-app notifications (bell icon):
- All triggered notifications also appear in the bell dropdown
- Badge count shows unread notifications
- Clicking the bell marks all as read
- Notifications stored in MongoDB with type, message, and timestamp

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password}` | Register |
| POST | `/api/auth/login` | `{email, password}` | Login → returns JWT |
| GET | `/api/auth/me` | — | Get current user |

### Medications (require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications` | List all medications |
| POST | `/api/medications` | Add medication |
| PUT | `/api/medications/:id` | Update / mark as taken |
| DELETE | `/api/medications/:id` | Remove medication |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | List appointments |
| POST | `/api/appointments` | Add appointment |
| PUT | `/api/appointments/:id` | Update |
| DELETE | `/api/appointments/:id` | Cancel |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications + unread count |
| PATCH | `/api/notifications` | Mark all as read |

---

## 🧩 Key Features

- ✅ JWT authentication (register / login / persistent sessions)
- ✅ Add / remove medications with color tags, dose times, tutorial links
- ✅ Add / cancel appointments with date, time, location
- ✅ Email reminders at exact medication dose times
- ✅ Low stock email alert when < 10 days remaining  
- ✅ Appointment reminder email the day before
- ✅ In-app notification bell with badge count
- ✅ Medication adherence tracking (mark as taken)
- ✅ YouTube tutorial links per medication
- ✅ Vercel Cron Jobs for fully automated scheduling
- ✅ MongoDB Atlas for cloud data persistence

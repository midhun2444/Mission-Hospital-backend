# Sivagiri Sree Narayana Medical Mission Hospital — Web Platform

Two independent projects:

- **backend/** — Node.js + Express + MongoDB REST API (auth, doctors, departments,
  patients, appointments/tokens, AI assistant endpoint).
- **frontend/** — React + Vite + Tailwind CSS single-page app that consumes the API
  (and falls back to bundled mock data if the API isn't running, so it's demoable
  on its own).

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run seed               # populates departments + doctors
npm run dev                 # http://localhost:5000
```

You need a MongoDB instance — either local (`mongodb://localhost:27017/mission_hospital`)
or a free MongoDB Atlas cluster. Paste its connection string into `MONGO_URI`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_BASE_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173. If the backend isn't running, the UI still works using
mock data defined in `frontend/src/data/mockData.js` — every API call in
`frontend/src/services/api.js` has a fallback.

## What's implemented

- JWT auth (register/login), password hashing, role field (admin/reception/doctor/patient)
- Departments & doctors CRUD (read is public, write is admin-only)
- Patient lookup by 6-digit file number + new patient registration
- Token-based appointment booking with a real uniqueness constraint
  (`{doctor, date, token}` index) so two people can't double-book the same slot
- Arrival-time calculation from token number + doctor's start time + slot length
- Appointment list / cancel / reschedule
- A rule-based `/api/ai/chat` endpoint (see `backend/controllers/ai.controller.js`
  for where to plug in a real LLM call)
- Rate limiting, Helmet, CORS, centralized error handling

## What's intentionally out of scope / left as extension points

This is a solid functional core, not the full feature list from the original spec.
Not implemented, but straightforward to add on top of this structure:

- PDF generation & QR codes for appointment passes (suggest `pdfkit` + `qrcode` npm packages)
- SMS/OTP and email notifications (Twilio / SendGrid)
- Socket.IO live queue updates
- Admin/Reception/Doctor dashboards (the data model already supports role-based
  access — the UI panels themselves aren't built)
- Dark mode (the toggle exists in the header but isn't wired to a theme yet)
- Real map embed on the Contact page

## Real hospital details already wired in

Name, address, phone numbers, email, and website are pulled from the hospital's
own ID card (Sivagiri Sree Narayana Medical Mission Hospital, Varkala, Kerala).
Doctor names/specialties are still placeholder data — swap `backend/seed/seed.js`
with real staff details when you have them.

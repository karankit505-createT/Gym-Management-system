# IronPulse Gym Management System 🏋️‍♂️

A complete, production-ready full-stack Gym Management Web Application built with **Node.js, Express.js, MySQL (Sequelize ORM), React.js (Vite + Tailwind CSS), JWT Authentication, Razorpay Payment Gateway**, Multer file uploads, and Nodemailer email notifications.

---

## 🌟 Key Features

### 1. **Public Landing Page**
- Responsive modern dark-themed landing page with vibrant orange/red accents.
- Hero banner, About section, Facilities list, Member testimonials, and Contact inquiry form.
- Membership Plans pricing cards (Monthly, Quarterly, Half-Yearly, VIP Yearly).

### 2. **User (Member) Module**
- **Registration**: Full Name, Email, Phone, Password, Gender, DOB, Address, and Profile Photo upload.
- **OTP Verification**: Email OTP verification step before account activation.
- **Secure Login & Password Reset**: JWT token authentication + OTP password reset flow.
- **Dashboard**:
  - Displays current membership status: `Active` / `Expired` / `Not a member`.
  - Expiring soon notification banner (highlighted if plan expires within 7 days).
  - Active plan validity counter (start date, end date, remaining days).
  - Gym notices & announcements feed.
- **Plan Selection & Payment**:
  - Razorpay test mode payment integration (Card, UPI/QR, Net Banking simulation).
  - Auto-calculates start & end dates based on plan duration.
  - Auto-generates downloadable **PDF Invoice / Payment Receipt**.
  - Sends instant email confirmation.
- **Payment History**: View past transactions with 1-click PDF receipt downloads.
- **Profile Edit**: Update photo, phone number, address, or change password.

### 3. **Staff Module**
- Dedicated staff portal.
- Member lookup by name, email, or phone.
- Daily check-in / check-out attendance logging.
- Today's attendance activity log table.

### 4. **Admin (Gym Owner) Module**
- **Dashboard Analytics**:
  - Overview cards: Total Users, Active Members, Expired Members, Total Revenue, Monthly Revenue.
  - Interactive **Monthly Revenue Trend Chart** (Bar Chart).
  - **Expiring in 7 Days** highlighted member alert list.
- **Member Management**:
  - Search & filter members by status (`active`, `expiring_soon`, `expired`).
  - View individual member profile & payment history.
  - Manually activate, extend, or deactivate memberships.
  - Delete member accounts.
- **Staff Management**:
  - Add new staff with custom designation and permissions.
  - List & remove staff members.
- **Plan Management (CRUD)**:
  - Create, edit, and deactivate membership plans (Name, duration in days, price, description).
  - Changes immediately sync with the public pricing page.
- **Payment Audit & Reports**:
  - View all transaction records.
  - Filter by date range, payment status, or plan.
  - **Export CSV Report** button for tax/accounting.
- **Announcements**: Post notices visible on all member dashboards.

---

## 📁 Folder Structure

```
d:/gym
├── backend/
│   ├── config/             # Database connection & auto-creation logic
│   ├── controllers/        # Auth, User, Plan, Membership, Payment, Admin, Attendance
│   ├── middleware/         # Auth (JWT+RBAC), Multer upload, Rate Limiting
│   ├── models/             # Sequelize Models (User, Plan, Membership, Payment, Staff, Attendance, Announcement, OtpVerification)
│   ├── routes/             # REST API Routes
│   ├── utils/              # Emailer (Nodemailer), PDF Generator (PDFKit), DB Seeder
│   ├── uploads/            # Profile & Staff photos static folder
│   ├── schema.sql          # Complete MySQL Database Schema script
│   ├── server.js           # Express main server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, Footer, ProtectedRoute, RazorpayCheckoutModal, StatCard
    │   ├── context/        # AuthContext (JWT & state management)
    │   ├── pages/          # Home, Login, Register, ForgotPassword, MemberDashboard, ChoosePlan, MemberProfile, PaymentHistory, StaffDashboard, AdminDashboard, ManageMembers, ManageStaff, ManagePlans, PaymentReports, ManageAnnouncements
    │   ├── services/       # Axios API client with bearer token interceptor
    │   ├── App.jsx         # Routing configuration
    │   └── main.jsx
    └── package.json
```

---

## 🔑 Pre-seeded Accounts (Default Credentials)

After running the database seeder (`npm run seed` in backend), you can log in immediately with:

| Role | Email | Password | Access / Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@ironpulse.com` | `admin123` | Full control panel, charts, member CRUD, staff CRUD, plan CRUD, CSV export |
| **Staff** | `staff@ironpulse.com` | `staff123` | Staff portal, member attendance check-in / check-out |
| **Member** | `member@ironpulse.com` | `member123` | Active Quarterly Pro plan, payment history, PDF invoice download |

*Note: You can also register new member accounts directly from the UI!*

---

## 🚀 Setup & Running Instructions

### 1. Database Setup (MySQL)
Make sure your MySQL server is running locally on port `3306` (or set `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `backend/.env`).

> Note: The backend will automatically create the database `gym_management` and synchronize all tables on startup. You can also import `backend/schema.sql` into phpMyAdmin / MySQL Workbench if desired.

### 2. Backend Setup & Seeding

```bash
cd backend

# Install dependencies
npm install

# Seed default admin, staff, member, and plan data into MySQL
npm run seed

# Start the Backend Server (Runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite React Dev Server (Runs on http://localhost:5173)
npm run dev
```

---

## ⚙️ Environment Variables (.env)

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=gym_management

JWT_SECRET=super_secret_gym_jwt_key_2026_xyz
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_gym123456789
RAZORPAY_KEY_SECRET=test_secret_gym_razorpay_98765

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=test@ethereal.email
SMTP_PASS=testpass
EMAIL_FROM="IronPulse Gym <noreply@ironpulse.com>"

UPLOAD_PATH=uploads
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_gym123456789
```

---

## 🛠️ API Endpoint Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user + send OTP | Public |
| `POST` | `/api/auth/verify-otp` | Verify OTP code & activate account | Public |
| `POST` | `/api/auth/login` | Login user/staff/admin | Public |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP | Public |
| `POST` | `/api/auth/reset-password` | Reset password via OTP | Public |
| `GET` | `/api/plans` | Fetch active plans | Public |
| `GET` | `/api/membership/status` | Current user membership status & alerts | Member |
| `POST` | `/api/payment/create-order` | Create Razorpay order | Member |
| `POST` | `/api/payment/verify` | Verify payment & activate membership | Member |
| `GET` | `/api/payment/invoice/:id` | Download PDF receipt invoice | Member / Admin |
| `GET` | `/api/user/profile` | Get current user profile | Authenticated |
| `PUT` | `/api/user/profile` | Update profile details / photo | Authenticated |
| `GET` | `/api/admin/dashboard-stats` | Get overview metrics & revenue trend | Admin |
| `GET` | `/api/admin/members` | Get all members with search & status filters | Admin |
| `PUT` | `/api/admin/members/:id/membership` | Manually activate/extend membership | Admin |
| `DELETE` | `/api/admin/members/:id` | Delete member account | Admin |
| `GET` | `/api/admin/staff` | List staff accounts | Admin |
| `POST` | `/api/admin/staff` | Add new staff member | Admin |
| `DELETE` | `/api/admin/staff/:id` | Delete staff member | Admin |
| `GET` | `/api/admin/payments` | Payment transactions & CSV export | Admin |
| `POST` | `/api/attendance/mark` | Mark member check-in / check-out | Staff / Admin |
| `GET` | `/api/attendance/logs` | Fetch attendance history | Staff / Admin |

---

## 🏅 Summary of Completed Deliverables
- [x] Complete `/backend` and `/frontend` separate folder structure
- [x] Database schema defined in MySQL with foreign keys, indexes, and models
- [x] Express.js server with REST APIs, JWT Auth, Role-Based Access Control, Rate Limiting & Multer
- [x] Nodemailer OTP & transaction email notifications
- [x] Razorpay Test Payment Gateway integration with signature verification
- [x] Automated PDF Invoice generation for receipts
- [x] React.js + Tailwind CSS dark-themed responsive UI
- [x] Admin analytics charts, Member CRUD, Staff Management, Plan CRUD, CSV Audit exports
- [x] Staff Attendance check-in / check-out module
- [x] Database seeder (`npm run seed`) with default admin, staff, demo member, and membership plans

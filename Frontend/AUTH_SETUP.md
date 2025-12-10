# Focus Flow Timer - Authentication System

Complete authentication system with email/password and Google OAuth integration.

## 🚀 Features

- ✅ Email/Password Authentication with secure password hashing
- ✅ Google OAuth Integration
- ✅ JWT-based authentication with refresh tokens
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ User profile management
- ✅ Timer session tracking per user
- ✅ Rate limiting and security headers
- ✅ CSRF protection
- ✅ Responsive and accessible UI
- ✅ Real-time form validation

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google Cloud Console account (for OAuth)

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/timerflow

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your_secure_random_string_here
JWT_REFRESH_SECRET=another_secure_random_string_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas:**
Use the connection string from your Atlas cluster in `.env`

#### Run Backend Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### 2. Frontend Setup

```bash
# From project root
npm install
```

#### Configure Frontend Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### Run Frontend

```bash
npm run dev
```

Visit http://localhost:5173

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Choose **Web application**
6. Add Authorized JavaScript origins:
   - `http://localhost:5173`
   - Your production domain
7. Add Authorized redirect URIs:
   - `http://localhost:5173`
   - Your production domain
8. Copy **Client ID** and **Client Secret**
9. Add Client ID to both frontend `.env` and backend `.env`
10. Add Client Secret to backend `.env`

### 4. Email Configuration (Gmail Example)

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Account → Security → App passwords
4. Use the app password in backend `.env` as `SMTP_PASS`

## 📦 Project Structure

```
focus-flow-timer/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database & config
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth, validation, etc.
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helpers
│   │   └── index.ts           # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   ├── components/
│   │   ├── ProtectedRoute.tsx # Auth guard
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   ├── Profile.tsx
│   │   └── GoogleLogin.tsx
│   ├── services/
│   │   └── auth.service.ts    # API calls
│   ├── types/
│   │   └── auth.types.ts      # TypeScript types
│   └── App.tsx
│
├── .env.example
└── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset

### Timer Sessions
- `POST /api/sessions` - Create timer session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/stats` - Get statistics

## 🧪 Testing

### Manual Testing Checklist

#### Registration & Login
- [ ] Sign up with email/password
- [ ] Validation errors display correctly
- [ ] Sign in with created account
- [ ] Sign in with Google
- [ ] Protected routes redirect to login
- [ ] Invalid credentials show error

#### Password Reset
- [ ] Request password reset email
- [ ] Receive email with reset link
- [ ] Reset password with token
- [ ] Sign in with new password

#### Profile Management
- [ ] Update profile name
- [ ] Update email
- [ ] Change password
- [ ] Sign out

#### Timer Integration
- [ ] Timer sessions save to user account
- [ ] Timer Insights show user data
- [ ] Data persists across devices
- [ ] Sessions tracked by mode

#### Security
- [ ] Refresh token rotation works
- [ ] Token expiration redirects to login
- [ ] Rate limiting prevents abuse
- [ ] XSS/CSRF protection active

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Short-lived access + refresh tokens
- **HTTP-only Cookies**: CSRF protection
- **Rate Limiting**: Prevents brute force
- **Helmet.js**: Security headers
- **Input Validation**: express-validator
- **Password Requirements**: 8+ chars, mixed case, numbers

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_ACCESS_SECRET=your_secret
# ... set all environment variables
git push heroku main
```

### Frontend Deployment (Example: Vercel)

```bash
# Install Vercel CLI
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend.herokuapp.com/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_ACCESS_SECRET | Access token secret | Yes |
| JWT_REFRESH_SECRET | Refresh token secret | Yes |
| GOOGLE_CLIENT_ID | Google OAuth client ID | Yes |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | Yes |
| SMTP_* | Email configuration | For password reset |
| FRONTEND_URL | Frontend URL for CORS | Yes |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |
| VITE_GOOGLE_CLIENT_ID | Google OAuth client ID | Yes |

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Google OAuth Not Working
- Verify Client ID matches in both envs
- Check authorized origins in Google Console
- Ensure Google+ API is enabled

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check cors configuration in backend

### Email Not Sending
- Verify SMTP credentials
- Check Gmail app password
- Ensure less secure apps enabled (if using Gmail)

## 📚 Additional Resources

- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🤝 Support

For issues or questions:
1. Check this README
2. Review error logs
3. Check browser console
4. Verify environment variables

## 📄 License

MIT License - See LICENSE file for details

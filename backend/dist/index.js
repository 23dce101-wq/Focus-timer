"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const habit_routes_1 = __importDefault(require("./routes/habit.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
dotenv_1.default.config();
// console.log('GOOGLE_CLIENT_ID from env =', process.env.GOOGLE_CLIENT_ID);
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
// Security middleware
// Configure Helmet without enforcing COOP/COEP so that we can
// explicitly control those headers for Google OAuth popups below.
app.use((0, helmet_1.default)({
    // Disable COEP via Helmet so that it does not interfere with
    // cross-origin resources; we set an explicit header separately.
    crossOriginEmbedderPolicy: false,
    // Disable Helmet's COOP handling; we will set
    // Cross-Origin-Opener-Policy manually to the required value.
    crossOriginOpenerPolicy: false,
}));
// Explicit COOP/COEP headers for Google OAuth popups and redirects.
// These must be applied before all routes so that any auth endpoints
// (e.g. /api/auth/google) inherit them.
app.use((req, res, next) => {
    // Allow this origin to open popups (Google OAuth window) without
    // being isolated in a separate browsing context.
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    // Keep COEP disabled so that third-party scripts/iframes used by
    // Google Identity Services continue to work.
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});
// CORS configuration
// Use a strict, explicit allow-list of frontend origins.
// Do NOT derive this from environment variables to avoid
// accidental overexposure in production.
const allowedOrigins = [
    'https://timer-flow.vercel.app', // Production frontend (Vercel)
    'http://localhost:5173', // Vite dev server
    'http://localhost:8080', // Optional local fallback/dev server
];
// Dynamic CORS middleware allowing credentials (cookies, auth headers).
// This is required so that Google OAuth and session cookies work
// correctly between the frontend and this API.
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow non-browser requests (no Origin header)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error('CORS_NOT_ALLOWED_BY_SERVER'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));
// Ensure preflight OPTIONS requests succeed for all allowed origins.
// This mirrors the same allow-list above and is important for browsers
// to accept cross-origin requests from the configured frontends.
app.options('*', (0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));
// Body parsing middleware (after CORS)
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Health check
app.get('/api/health', (req, res, _next) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/sessions', session_routes_1.default);
app.use('/api/habits', habit_routes_1.default);
app.use('/api', contact_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map
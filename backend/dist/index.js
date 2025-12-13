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
console.log('GOOGLE_CLIENT_ID from env =', process.env.GOOGLE_CLIENT_ID);
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
// Security middleware
app.use((0, helmet_1.default)());
// CORS configuration
const allowedOrigins = [
    'https://focus-timer-flame.vercel.app', // production frontend
    'http://localhost:5173', // local dev
];
// Dynamic CORS middleware allowing credentials
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
// Ensure preflight OPTIONS returns success
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
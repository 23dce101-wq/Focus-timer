"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.signup);
router.post('/login', auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.post('/google', auth_controller_1.googleLogin);
router.get('/me', auth_middleware_1.requireAuth, auth_controller_1.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
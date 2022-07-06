import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller';
import * as authValidation from './routes-validation/auth.schema';
const authRoutes: Router = express.Router();

// specific rate limiter for auth routes
authRoutes.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	})
);

authRoutes.post('/login', authValidation.loginSchema, authController.login);
authRoutes.post('/register', authValidation.registerSchema, authController.register);
authRoutes.post(
	'/forget-password',
	authValidation.forgetPasswordSchema,
	authController.forgotPassword
);
authRoutes.post(
	'/reset-password',
	authValidation.resetPasswordSchema,
	authController.resetPassword
);

authRoutes.get('/verify-email', authValidation.verifyEmailSchema, authController.verifyEmail);

export { authRoutes as default };

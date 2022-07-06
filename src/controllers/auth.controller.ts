import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../types/http-status.enum';
import * as authService from '../services/auth.service';
import { User } from '@prisma/client';
import ApiError from '../utils/apiError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	try {
		const user: Partial<User> = await authService.login({ email, password });
		res.status(HttpStatus.OK).json({ message: 'LOGIN SUCCESSFULLY', user });
	} catch (error) {
		next(error);
	}
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	try {
		const user: Partial<User> = await authService.register({ email, password });
		res.status(HttpStatus.CREATED).json({ message: 'REGISTERED SUCCESSFULLY', user });
	} catch (error) {
		next(error);
	}
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;
	try {
		await authService.sendForgottenPasswordEmail(req, email);
		res.status(HttpStatus.OK).json({ message: 'email send to your email' });
	} catch (error) {
		next(error);
	}
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	const { token, password } = req.body;
	try {
		await authService.resetPassword(token, password);
		res.status(HttpStatus.OK).json({ message: 'your password changed successfully' });
	} catch (error) {
		next(error);
	}
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.query;
	try {
		if (typeof token !== 'string') {
			throw new ApiError('token is invalid', HttpStatus.BAD_REQUEST);
		}
		await authService.verifyToken(token);
		res.status(HttpStatus.OK).json({ message: 'your email verified successfully' });
	} catch (error) {
		next(error);
	}
};

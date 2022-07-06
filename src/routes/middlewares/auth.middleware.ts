import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import prisma from '../../config/database/connectToDB';
import { HttpStatus } from '../../types/http-status.enum';
import ApiError from '../../utils/apiError';

export const isVerified = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;
	try {
		const user: User | null = await prisma.user.findFirst({
			where: { email }
		});

		if (!user) {
			throw new ApiError("can't find user with this email", HttpStatus.BAD_REQUEST);
		}
		if (!user.emailVerified) {
			throw new ApiError("can't find user with this email", HttpStatus.UNAUTHORIZED);
		}
		next();
	} catch (error) {
		next(error);
	}
};

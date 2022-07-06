// import { User } from '@prisma/client';
// import prisma from '../config/database/connectToDB';
// import { HttpStatus } from '../types/http-status.enum';
// import ApiError from '../utils/apiError';

// export const findUserByEmail = async (
// 	email: string,
// 	errorMessage?: string,
// 	statusCode?: number
// ): Promise<User | null> => {
// 	const isUserExist: User | null = await prisma.user.findFirst({ where: { email } });

// 	// check user existence
// 	if (isUserExist === null) {
// 		const httpStatusCode = statusCode || HttpStatus.NOT_FOUND;
// 		const message = errorMessage || "can't find any user with this email.";
// 		throw new ApiError(message, httpStatusCode);
// 	}

// 	return isUserExist;
// };

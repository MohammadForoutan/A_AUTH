import { User } from '@prisma/client';
import prisma from '../config/database/connectToDB';
import bcrypt from 'bcrypt';
import ApiError from '../utils/apiError';
import { HttpStatus } from '../types/http-status.enum';
import { CreateUserDto, LoginUserDto } from '../types/dto/user.dto';
import { getEnv } from '../config/getEnv';
import { sendEmail } from '../utils/nodemailer';
import { Request } from 'express';
import { generateToken, hashToken } from '../utils/hash';

export const register = async (createUserDto: CreateUserDto): Promise<Partial<User>> => {
	const { email, password } = createUserDto;

	// check have a user with this email or not
	const isUserExist: User | null = await prisma.user.findFirst({
		where: { email: email.toLowerCase() }
	});

	if (isUserExist) {
		// throw  error user with this email already exist
		throw new ApiError('A user with this email already exist', HttpStatus.CONFLICT);
	}
	// if no user with this email found - sign up user
	// first hash password
	const saltRounds = await bcrypt.genSaltSync(+getEnv('SALT_ROUND'));
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	// set email_verified token
	const verifiedEmailToken = generateToken();
	const hashedVerifiedEmailToken = hashToken(verifiedEmailToken);

	// insert user to db
	const newUser: User = await prisma.user.create({
		data: {
			email: email.toLowerCase(),
			password: hashedPassword,
			emailVerified: false,
			emailVerifiedToken: hashedVerifiedEmailToken
		}
	});

	// send email to verified his/her email
	const url = `http://host:port/auth/verify-email?token=${verifiedEmailToken}`;
	sendEmail(newUser.email, url, 'verify your email.');

	// return user - remove private details
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: removedPassword, ...otherUserData } = newUser;
	return otherUserData;
};

export const login = async (loginUserDto: LoginUserDto): Promise<Partial<User>> => {
	const { email, password } = loginUserDto;
	// check have a user with this email or not
	const isUserExist: User | null = await prisma.user.findFirst({
		where: { email: email.toLowerCase() }
	});

	if (isUserExist === null) {
		throw new ApiError('Wrong Credentials', HttpStatus.BAD_REQUEST);
	}

	// compare password
	const user = isUserExist;
	const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);
	if (!isPasswordCorrect) {
		throw new ApiError('Wrong Credentials', HttpStatus.BAD_REQUEST);
	}
	// if password and email are matched
	// return user - remove private details
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: removedPassword, ...otherUserData } = user;
	return otherUserData;
};

export const sendForgottenPasswordEmail = async (req: Request, email: string): Promise<void> => {
	const isUserExist: User | null = await prisma.user.findFirst({ where: { email } });

	if (!isUserExist) {
		throw new ApiError("can't find any user with this email", HttpStatus.NOT_FOUND);
	}

	const user = isUserExist;
	// create token
	const resetToken = generateToken();
	const passwordResetToken = hashToken(resetToken);
	// set token in user record in db
	await prisma.user.update({
		where: { id: user.id },
		data: {
			passwordResetToken,
			passwordResetAt: new Date(Date.now() + 10 * 60 * 1000)
		}
	});
	// reset password url
	const url = `http://${req.hostname}:${+getEnv('PORT')}/path/to/url/${resetToken}`;
	const template = url;
	// send email
	sendEmail(user.email, template, 'RESET PASSWORD');
};

export const resetPassword = async (resetToken: string, newPassword: string): Promise<void> => {
	// generate hash
	const passwordResetToken = hashToken(resetToken);
	// check token validation and expire time
	const user: User | null = await prisma.user.findFirst({
		where: { passwordResetToken, passwordResetAt: { gte: new Date() } }
	});

	if (!user) {
		throw new ApiError('Invalid token or token has expired', HttpStatus.FORBIDDEN);
	}

	// update user password
	const genSalt = await bcrypt.genSalt(+getEnv('SALT_ROUND'));
	console.log({ genSalt });

	const hashedPassword = await bcrypt.hash(newPassword, genSalt);
	await prisma.user.update({
		where: { id: user.id },
		data: { password: hashedPassword, passwordResetAt: null, passwordResetToken: null }
	});
};

export const verifyToken = async (token: string): Promise<void> => {
	const hashedToken = hashToken(token);
	// verify email and update user
	await prisma.user.update({
		where: { emailVerifiedToken: hashedToken },
		data: { emailVerified: true }
	});
};

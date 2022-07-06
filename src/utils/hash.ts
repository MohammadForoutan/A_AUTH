import crypto from 'crypto';

export const hashToken = (token: string): string => {
	return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateToken = (): string => {
	return crypto.randomBytes(32).toString('hex');
};

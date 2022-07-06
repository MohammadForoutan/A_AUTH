export default class ApiError extends Error {
	constructor(public message: string, public statusCode: number) {
		super();

		this.message = message || 'Something went wrong. Please try again.';
		this.statusCode = statusCode || 500;
		Error.captureStackTrace(this);
	}
}

import express, {
	Application,
	ErrorRequestHandler,
	NextFunction,
	Request,
	Response
} from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import { errors } from 'celebrate';
import ApiError from './utils/apiError';

// config & load  env variables
if (typeof process.env.NODE_ENV !== 'undefined') {
	const NODE_ENV: string = process.env.NODE_ENV;
	dotenv.config({
		path: path.join(process.cwd(), 'src', 'config', 'env', `.env.${NODE_ENV}`)
	});
}
// express app
const app: Application = express();

// middlewares

// set CORS
app.use(cors({ origin: '*' }));
// parse json request body
app.use(express.json());
// logger
app.use(morgan.default('dev'));
// set security HTTP headers
app.use(helmet());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// routes
app.use('/auth', authRoutes);
// celebrate validation error handling
app.use(errors());

// 404
app.use((req: Request, res: Response) => {
	res.status(404).json({ message: 'NOT FOUND', url: req.url });
});
// 5xx and other error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: ErrorRequestHandler & ApiError, req: Request, res: Response, next: NextFunction) => {
	const { statusCode, message } = err;

	if (statusCode >= 500 || !statusCode) {
		console.log({ error: err, message: err.message, url: req.url });
	}
	res.status(statusCode || 500).json({
		message: message || 'INTERNAL SERVER ERROR',
		url: req.url
	});
});

export { app };

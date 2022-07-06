declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test' | undefined;
			PORT: string | undefined;
			POSTGRES_DB_URL: string | undefined;
			SALT_ROUND: string | undefined;
			EMAIL_PROVIDER: string | undefined;
			EMAIL_USER: string | undefined;
			EMAIL_PASS: string | undefined;
		}
	}
}

export {};

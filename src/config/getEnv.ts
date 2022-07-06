// all env variables
type ENVS =
	| 'PORT'
	| 'NODE_ENV'
	| 'POSTGRES_DB_URL'
	| 'SALT_ROUND'
	| 'EMAIL_PROVIDER'
	| 'EMAIL_USER'
	| 'EMAIL_PASS';

// check variables exist
function getEnv(env: ENVS) {
	const envValue = process.env[env];
	if (typeof envValue === 'undefined') {
		throw new Error(`ERROR in environment: ${env} NOT FOUND`);
	}

	return envValue;
}
export { getEnv };

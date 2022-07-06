import { app } from './app';
import { getEnv } from './config/getEnv';

const PORT: number = +getEnv('PORT');

app.listen(PORT, () => {
	console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

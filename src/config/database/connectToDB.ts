import { PrismaClient } from '@prisma/client';
import { getEnv } from '../getEnv';

/**
 * it will automatically call prisma.$connect (under the hood) when first request is made
 * it will automatically call prisma.$disconnect (under the hood) when Node process end
 */
const prisma = new PrismaClient({
	datasources: { db: { url: getEnv('POSTGRES_DB_URL') } }
});

export default prisma;

import * as Joi from 'joi';

export interface DatabaseConfig {
	host: string;
	port: number;
	uri: string;
}

export const databaseConfig = () => ({
	database: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10),
		uri: process.env.DATABASE_URI,
	},
});

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test', 'provision', 'staging')
		.default('development'),
	PORT: Joi.number().default(3000),
});

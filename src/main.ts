import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { configSwagger } from '@/configs/api-docs.config';

import { AppModule } from './app.module';
import { configCors } from './configs/cors.config';
import { LoggerFactory } from './configs/logger';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);
	const app = await NestFactory.create(AppModule, {
		logger: LoggerFactory('API'),
	});
	configSwagger(app);
	configCors(app);
	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	await app.listen(configService.get('PORT') || 3000, () =>
		logger.log(`Application running on port ${configService.get('PORT')}`),
	);
}
bootstrap();

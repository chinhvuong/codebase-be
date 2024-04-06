import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configSwagger } from '@/configs/api-docs.config';
import { LoggerFactory } from './configs/logger';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);
	const app = await NestFactory.create(AppModule, {
		logger: LoggerFactory('API'),
	});
	configSwagger(app);
	const configService = app.get(ConfigService);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	await app.listen(configService.get('PORT'), () =>
		logger.log(`Application running on port ${configService.get('PORT')}`),
	);
}
bootstrap();

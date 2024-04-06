import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {
	databaseConfig,
	validationSchema,
} from './configs/configuration.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
			load: [databaseConfig],
			expandVariables: true,
			cache: true,
			validationSchema: validationSchema,
			validationOptions: {
				abortEarly: false,
			},
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	databaseConfig,
	validationSchema,
} from './configs/configuration.config';
import { UsersModule } from '@/modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { RequestLoggerMiddleware } from './modules/shared/base/logger.middleware';
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
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				console.log(configService.get<string>('DATABASE_URI'));

				return {
					uri: configService.get<string>('DATABASE_URI'),
					dbName: configService.get<string>('DATABASE_NAME'),
				};
			},
			inject: [ConfigService],
		}),
		UsersModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestLoggerMiddleware).forRoutes('*');
	}
}

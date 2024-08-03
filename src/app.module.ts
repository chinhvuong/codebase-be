import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as redisStore from 'cache-manager-redis-store';

import { UsersModule } from '@/modules/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
	databaseConfig,
	validationSchema,
} from './configs/configuration.config';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { FollowModule } from './modules/follow/follow.module';
import { RequestLoggerMiddleware } from './modules/shared/middlewares/logger.middleware';
import { RepositoryModule } from './repositories/repository.module';

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
				return {
					uri: configService.get<string>('DATABASE_URI'),
					dbName: configService.get<string>('DATABASE_NAME'),
				};
			},
			inject: [ConfigService],
		}),
		CacheModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					store: redisStore,
					host: configService.get('REDIS_HOST'),
					port: configService.get('REDIS_PORT'),
					ttl: 120 * 1000000,
				};
			},
			isGlobal: true,
		}),
		RepositoryModule,
		UsersModule,
		AuthModule,
		FollowModule,
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

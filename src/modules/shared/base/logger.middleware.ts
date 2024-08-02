// request-logger.middleware.ts

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	private logger = new Logger('RequestLogger');

	use(req: Request, res: Response, next: NextFunction) {
		const { method, originalUrl, ip } = req;
		const start = Date.now();

		res.on('finish', () => {
			const duration = Date.now() - start;
			const { statusCode } = res;
			this.logger.log(
				`${method} ${originalUrl} ${statusCode} ${duration}ms ${ip}`,
			);
		});

		// Handle errors
		res.on('error', (error) => {
			this.logger.error(`Request error: ${error.message}`, error.stack);
		});

		next();
	}
}

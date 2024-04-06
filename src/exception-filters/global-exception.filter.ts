import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private logger = new Logger('ExceptionLogger');

	constructor(private readonly configService: ConfigService) {}
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException ? exception.getStatus() : 500;

		const message =
			exception instanceof HttpException
				? exception.message
				: 'Internal server error';
		response.status(status).json({
			statusCode: status,
			message,
			error:
				this.configService.get('NODE_ENV') !== 'production'
					? {
							response: exception.response,
							stack: exception.stack,
						}
					: null,
		});
		this.logger.debug(
			`${response.req.method} ${response.req.originalUrl} ${exception.message} ${JSON.stringify(response.req.body)}`,
		);
	}
}

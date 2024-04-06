import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
const apiDocumentationCredentials = {
	name: 'admin',
	pass: 'admin',
};

export function configSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('API project')
		.setDescription('## The API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	const http_adapter = app.getHttpAdapter();
	http_adapter.use(
		'/docs',
		(req: Request, res: Response, next: NextFunction) => {
			function parseAuthHeader(input: string): { name: string; pass: string } {
				const [, encodedPart] = input.split(' ');

				const buff = Buffer.from(encodedPart, 'base64');
				const text = buff.toString('ascii');
				const [name, pass] = text.split(':');

				return { name, pass };
			}

			function unauthorizedResponse(): void {
				if (http_adapter.getType() === 'fastify') {
					res.statusCode = 401;
					res.setHeader('WWW-Authenticate', 'Basic');
				} else {
					res.status(401);
					res.set('WWW-Authenticate', 'Basic');
				}

				next();
			}

			if (!req.headers.authorization) {
				return unauthorizedResponse();
			}

			const credentials = parseAuthHeader(req.headers.authorization);

			if (
				credentials?.name !== apiDocumentationCredentials.name ||
				credentials?.pass !== apiDocumentationCredentials.pass
			) {
				return unauthorizedResponse();
			}

			next();
		},
	);
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: { persistAuthorization: true },
	});
}

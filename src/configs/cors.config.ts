import { INestApplication } from '@nestjs/common';

const whiteList = ['http://localhost:*'];
export function configCors(app: INestApplication) {
	app.enableCors({
		origin: whiteList,
	});
}

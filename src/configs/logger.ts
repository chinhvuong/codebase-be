import {
	utilities as nestWinstonModuleUtilities,
	WinstonModule,
} from 'nest-winston';
import { format, transports } from 'winston';

export const LoggerFactory = (appName: string) => {
	let consoleFormat;

	const DEBUG = true;
	const USE_JSON_LOGGER = false;

	if (USE_JSON_LOGGER) {
		consoleFormat = format.combine(
			format.ms(),
			format.timestamp(),
			format.json(),
		);
	} else {
		consoleFormat = format.combine(
			format.timestamp(),
			format.ms(),
			format.printf(
				(info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
			),
			nestWinstonModuleUtilities.format.nestLike(appName, {
				colors: true,
				prettyPrint: true,
			}),
		);
	}

	return WinstonModule.createLogger({
		level: DEBUG ? 'debug' : 'info',
		transports: [new transports.Console({ format: consoleFormat })],
	});
};

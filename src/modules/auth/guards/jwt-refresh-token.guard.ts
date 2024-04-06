import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('refresh-jwt') {
	// constructor(private reflector: Reflector) {
	//     super();
	// }
}

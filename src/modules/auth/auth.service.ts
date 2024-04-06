import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '@/modules/users/users.service';
import {
	BadRequestException,
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token.interface';

@Injectable()
export class AuthService {
	private SALT_ROUND = 10;
	constructor(
		private configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async signUp(signUpDto: SignUpDto) {
		try {
			const existedUser = await this.usersService.findOneByCondition({
				email: signUpDto.email,
			});
			if (existedUser) {
				throw new ConflictException('Email already existed!!');
			}
			const hashedPassword = await bcrypt.hash(
				signUpDto.password,
				this.SALT_ROUND,
			);
			const user = await this.usersService.create({
				...signUpDto,
				username: `${signUpDto.email.split('@')[0]}${Math.floor(
					10 + Math.random() * (999 - 10),
				)}`, // Random username
				password: hashedPassword,
			});
			return user;
		} catch (error) {
			throw error;
		}
	}

	async getAuthenticatedUser(email: string, password: string): Promise<User> {
		try {
			const user = await this.usersService.findOneByCondition(
				{ email },
				{ password: true },
			);

			if (
				!user ||
				!(await this.verifyPlainContentWithHashedContent(password, [
					user.password,
				]))
			) {
				throw new BadRequestException('Wrong credentials!!');
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	async signIn(userId: string) {
		try {
			const accessToken = this.generateAccessToken({
				userId,
			});
			const refreshToken = this.generateRefreshToken({
				userId,
			});
			await this.storeRefreshToken(userId, refreshToken);
			return {
				accessToken,
				refreshToken,
			};
		} catch (error) {
			throw error;
		}
	}

	async getUserIfRefreshTokenMatched(
		userId: string,
		refreshToken: string,
	): Promise<User> {
		try {
			const user = await this.usersService.findOneByCondition(
				{
					_id: userId,
				},
				{
					currentRefreshTokens: true,
				},
			);
			if (!user) {
				throw new UnauthorizedException();
			}
			if (
				!(await this.verifyPlainContentWithHashedContent(
					refreshToken.split('.')[2] || '_',
					user.currentRefreshTokens,
				))
			) {
				await this.usersService.update(userId, {
					currentRefreshTokens: [],
				});
				throw new UnauthorizedException();
			}

			return user;
		} catch (error) {
			throw error;
		}
	}

	private generateAccessToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
			expiresIn: `${this.configService.get<string>(
				'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	private generateRefreshToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
			expiresIn: `${this.configService.get<string>(
				'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	async storeRefreshToken(userId: string, token: string): Promise<void> {
		try {
			const hashedToken = await bcrypt.hash(
				token.split('.')[2] || '_',
				this.SALT_ROUND,
			);
			await this.usersService.setCurrentRefreshToken(userId, hashedToken);
		} catch (error) {
			throw error;
		}
	}

	private async verifyPlainContentWithHashedContent(
		plainText: string,
		hashedTexts: string[],
	) {
		try {
			for (const hash of hashedTexts) {
				const isMatching = await bcrypt.compare(plainText, hash);
				if (isMatching) {
					return true;
				}
			}

			return false;
		} catch (error) {
			return false;
		}
	}
}

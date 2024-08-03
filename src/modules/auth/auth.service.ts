import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PublicKey } from '@solana/web3.js';
import * as bcrypt from 'bcryptjs';
import * as nacl from 'tweetnacl';

import { UsersService } from '@/modules/users/users.service';

import { User } from '../users/entities/user.entity';
import { TokenPayload } from './interfaces/token.interface';

@Injectable()
export class AuthService {
	private SALT_ROUND = 10;
	constructor(
		private configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async signIn(userId: string) {
		try {
			const accessToken = this.generateAccessToken({
				userId: userId,
			});
			const refreshToken = this.generateRefreshToken({
				userId: userId,
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
				{ _id: userId },
				{ currentRefreshTokens: true },
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
				await this.usersService.update(userId, { currentRefreshTokens: [] });
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

	verifySignature(address: string, signature: string): boolean {
		try {
			const pubkey = new PublicKey(address);
			const decodedSignature = Uint8Array.from(Buffer.from(signature, 'hex'));
			const message = Buffer.from(address, 'utf-8');
			return nacl.sign.detached.verify(
				message,
				decodedSignature,
				pubkey.toBytes(),
			);
		} catch (error) {
			return false;
		}
	}
}

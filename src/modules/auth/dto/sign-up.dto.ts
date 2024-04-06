import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsStrongPassword,
	MaxLength,
} from 'class-validator';

export class SignUpDto {
	@ApiProperty()
	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}

import { BaseEntity } from '@/modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({
	timestamps: {
		createdAt: true,
		updatedAt: true,
	},
})
export class User extends BaseEntity {
	@Prop({
		required: true,
		unique: true,
	})
	email: string;

	@Prop({
		required: true,
		unique: true,
	})
	username: string;

	@Prop({
		required: true,
		select: false,
	})
	password: string;

	@Prop({
		type: [String],
		default: [],
		select: false,
	})
	currentRefreshTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

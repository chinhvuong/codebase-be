import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BaseEntity } from '@/modules/shared/entities/base.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseEntity {
	@Prop({ required: false })
	username: string;

	@Prop({ default: null })
	email: string;

	@Prop({ lowercase: true })
	address: string;

	@Prop({ default: false })
	hideAddress: boolean;

	@Prop({ default: null })
	avatar: string;

	@Prop({ default: null })
	twitter: string;

	@Prop({ default: null })
	telegram: string;

	@Prop({ default: null })
	discord: string;

	@Prop({ type: [String], default: [] })
	badges: string[];

	@Prop({ type: [String], default: [] })
	currentRefreshTokens: string[];

	@Prop({ default: 0 })
	followingCount: number;

	@Prop({ default: 0 })
	followersCount: number;

	@Prop({ default: 0 })
	point: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ address: 1 }); // Index on address for quick access

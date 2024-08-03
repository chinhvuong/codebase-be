import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { BaseEntity } from '@/modules/shared/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true })
export class Follow extends BaseEntity {
	@Prop({ type: Types.ObjectId, ref: User.name, required: true })
	followerId: Types.ObjectId;

	@Prop({ type: Types.ObjectId, ref: User.name, required: true })
	followingId: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

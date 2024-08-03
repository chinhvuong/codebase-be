import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class MongoIdDto {
	@ApiProperty()
	@IsMongoId()
	_id: string;
}

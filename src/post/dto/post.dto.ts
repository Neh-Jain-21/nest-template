import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
	description: string;
}

export class LikePostDTO {
	@ApiProperty()
	id: number;
}

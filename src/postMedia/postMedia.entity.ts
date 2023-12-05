import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// ENTITIES
import { Post } from 'src/post/post.entity';

@Entity({ name: 'PostMedia' })
export class PostMedia {
	@ApiProperty({ example: 1, description: 'Id of user' })
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'number', nullable: false })
	post_id: number;

	@Column({ type: 'string', nullable: false })
	media: string;

	@Column({ type: 'enum', enum: ['image', 'video'], nullable: false })
	type: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updated_at: Date;

	@OneToOne(() => Post, (post) => post.postMedias)
	post: Post;
}

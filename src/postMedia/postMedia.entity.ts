import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// ENTITIES
import { Posts } from 'src/post/posts.entity';

@Entity({ name: 'PostMedia' })
export class PostMedia {
	@ApiProperty({ example: 1, description: 'Id of user' })
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'int', nullable: false })
	post_id: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
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

	@OneToOne(() => Posts, (post) => post.postMedias, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
	post: Posts;
}

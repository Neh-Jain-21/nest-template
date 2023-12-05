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
import { User } from 'src/users/user.entity';

@Entity({ name: 'PostLikes' })
export class PostLikes {
	@ApiProperty({ example: 1, description: 'Id of user' })
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'number', nullable: false })
	user_id: number;

	@Column({ type: 'number', nullable: false })
	post_id: number;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updated_at: Date;

	@OneToOne(() => Post, (post) => post.postLikes)
	post: Post;

	@OneToOne(() => User, (user) => user.post)
	user: User;
}

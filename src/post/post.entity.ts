import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	OneToOne
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// ENTITIES
import { PostLikes } from 'src/postLikes/postLikes.entity';
import { PostMedia } from 'src/postMedia/postMedia.entity';
import { User } from 'src/users/user.entity';

@Entity({ name: 'Post' })
export class Post {
	@ApiProperty({ example: 1, description: 'Id of user' })
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'number', nullable: false })
	user_id: number;

	@Column({ type: 'text', nullable: false })
	description: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updated_at: Date;

	@OneToOne(() => User, (user) => user.post)
	user: User;

	@OneToMany(() => PostMedia, (postMedias) => postMedias.post)
	postMedias: PostMedia[];

	@OneToMany(() => PostLikes, (postLikes) => postLikes.post)
	postLikes: PostLikes[];
}

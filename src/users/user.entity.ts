import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/post/posts.entity';

@Entity({ name: 'Users' })
export class User {
	@ApiProperty({ example: 1, description: 'Id of user' })
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 20, nullable: false })
	first_name: string;

	@Column({ type: 'varchar', length: 20, nullable: false })
	last_name: string;

	@Column({ type: 'varchar', length: 30, nullable: false })
	email: string;

	@Column({ type: 'varchar', length: 250, nullable: false })
	phone: string;

	@Column({ type: 'varchar', length: 100, nullable: false })
	password: string;

	@Column({ type: 'varchar', length: 70, nullable: false })
	dob: string;

	@Column({ type: 'enum', enum: ['male', 'female'], nullable: false })
	gender: string;

	@Column({ type: 'varchar', length: 255, nullable: false })
	image: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	token: string;

	@Column({ type: 'varchar', length: 255, nullable: true, default: null })
	otp: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updated_at: Date;

	@OneToMany(() => Posts, (post) => post.user)
	post: Posts[];
}

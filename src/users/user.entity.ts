import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'Users' })
export class User {
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

	@Column({ type: 'varchar', length: 30, nullable: false })
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

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}

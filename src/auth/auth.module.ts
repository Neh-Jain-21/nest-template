import { Module, forwardRef } from '@nestjs/common';
// MODULES
import { UsersModule } from 'src/users/users.module';
import { MailingModule } from 'src/mailing/mailing.module';
// CONTROLLERS
import { AuthController } from './auth.controller';

@Module({
	imports: [MailingModule, forwardRef(() => UsersModule)],
	controllers: [AuthController]
})
export class AuthModule {}

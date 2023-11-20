import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// MODULES
import { UsersModule } from 'src/users/users.module';
// CONTROLLERS
import { AuthController } from './auth.controller';

@Module({
	imports: [forwardRef(() => UsersModule), JwtModule.register({ global: true, secret: 'nest' })],
	controllers: [AuthController]
})
export class AuthModule {}

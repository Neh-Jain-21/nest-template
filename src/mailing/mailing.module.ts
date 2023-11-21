import { Module } from '@nestjs/common';
// CONTROLLERS
import { MailingController } from './mailing.controller';
// SERVICES
import { MailingService } from './mailing.service';

@Module({
	providers: [MailingService],
	controllers: [MailingController],
	exports: [MailingService]
})
export class MailingModule {}

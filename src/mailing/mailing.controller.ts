import { Controller } from '@nestjs/common';
// SERVICES
import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
	constructor(readonly mailingService: MailingService) {}
}

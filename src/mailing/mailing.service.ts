import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailingService {
	constructor(private readonly mailerService: MailerService) {}

	async sendMail(to: string, subject: string, html: string) {
		return new Promise((resolve, reject) => {
			this.mailerService
				.sendMail({
					from: `"OpenXcell" <${process.env.EMAIL}>`,
					to: to,
					subject: subject,
					html: html
				})
				.then(resolve)
				.catch(reject);
		});
	}
}

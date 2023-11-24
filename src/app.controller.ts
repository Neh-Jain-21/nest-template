import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('/')
export class AppController {
	constructor() {}

	@Get()
	@HttpCode(HttpStatus.OK)
	root() {
		return 'Openxcell Backend';
	}
}

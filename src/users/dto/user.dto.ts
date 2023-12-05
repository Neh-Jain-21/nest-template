export class UpdateUserDetailsDTO {
	fname: string;
	lname: string;
	email: string;
	phone: string;
	dob: string;
	gender: string;
}

export class ChangePasswordDTO {
	oldPassword: string;
	newPassword: string;
}

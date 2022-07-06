import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { getEnv } from '../config/getEnv';

// email service provider credentials
const mailTransporter = nodemailer.createTransport({
	service: getEnv('EMAIL_PROVIDER'),
	auth: {
		user: getEnv('EMAIL_USER'),
		pass: getEnv('EMAIL_PASS')
	}
});

// send email
function sendEmail(emailTo: string, template: string, subject: string) {
	// email configuration
	const emailOptions: Mail.Options = {
		subject,
		from: getEnv('EMAIL_USER'),
		to: emailTo,
		text: template
	};

	mailTransporter.sendMail(emailOptions, function (err, data) {
		if (err) {
			console.log({ err });
		} else {
			console.log({ data });
		}
	});
}

export { sendEmail };

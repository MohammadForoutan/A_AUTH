import { celebrate, Joi, Segments } from 'celebrate';

export const registerSchema = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string()
			.pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
			.message(
				'password should Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'
			)
			.required()
	})
});

export const loginSchema = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required(),
		password: Joi.string()
			.pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
			.message(
				'password should Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'
			)
			.required()
	})
});

export const forgetPasswordSchema = celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().email().required()
	})
});

export const resetPasswordSchema = celebrate({
	[Segments.BODY]: Joi.object().keys({
		token: Joi.string().length(64).required(),
		password: Joi.string()
			.pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
			.message(
				'password should Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'
			)
	})
});

export const verifyEmailSchema = celebrate({
	[Segments.QUERY]: Joi.object().keys({
		token: Joi.string().length(64).required()
	})
});

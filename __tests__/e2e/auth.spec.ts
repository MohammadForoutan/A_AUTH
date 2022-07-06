import request from 'supertest';
import { app } from '../../src/app';
import prisma from '../../src/config/database/connectToDB';

beforeEach((done) => {
	prisma.user.deleteMany().then(() => done());
});

describe('POST: /auth/register - AUTH[REGISTER] ', () => {
	it('should fail with invalid input [no email]', (done) => {
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ password: 'Mo123*313kj' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('email');
				done();
			});
	});
	it('should fail with invalid input [wrong email format]', (done) => {
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: 'sample.com', password: 'Mo123*313kj' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('email');
				done();
			});
	});
	it('should fail with invalid input [no password]', (done) => {
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: 'sample@gmail.com' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('password');
				done();
			});
	});
	it('should fail with invalid input [wrong password format(length - lowercase - uppercase)]', (done) => {
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: 'sample@gmail.com', password: 'thisIsAgo#' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('password');
				done();
			});
	});
	it('should fail - a user already exists with this email ', (done) => {
		// register user one
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({
				email: 'mmdfrn81@gmail.com',
				password: 'mmdfrn81@Gmail.com'
			})
			.expect(201)
			.then(() => {
				// register user two with same email => expect error
				request(app)
					.post('/auth/register')
					.set('Accept', 'application/json')
					.send({
						email: 'mmdfrn81@gmail.com',
						password: 'mmdfrn81@Gmail.com'
					})
					.expect(409, done);
			});
	});
	it('should pass with no error ', (done) => {
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({
				email: 'mmdfrn81@gmail.com',
				password: 'mmdfrn81@Gmail.com'
			})
			.expect(201, done);
	});
});

describe('POST: /auth/login - AUTH[LOGIN]', () => {
	it('should fail with no user with this email', (done) => {
		request(app)
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({ email: 'moasdasd@mail.com', password: 'Mo12dsa@3*313kj' })
			.expect(400, done);
	});

	it('should fail with wrong password', (done) => {
		// register a user
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: 'moasdasd@mail.com', password: 'Mo12dsa@3*313kj' })
			.expect(201, done);
		// attempt to login
		request(app)
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({ email: 'moasdasd@mail.com', password: 'Mo12dsa@3*313kj_21321' })
			.expect(400)
			.then((res) => {
				expect(res.body.message).toEqual('Wrong Credentials');
				done();
			});
	});

	it('should fail with invalid input [no email]', (done) => {
		request(app)
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({ password: 'Mo12dsa@3*313kj' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('email');
				done();
			});
	});

	it('should fail with invalid input [no password]', (done) => {
		request(app)
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({ email: 'mmdfasds@mail.com' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('password');
				done();
			});
	});

	it('should fail with invalid input [wrong email format]', (done) => {
		request(app)
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({ email: 'HELLO.mail.com', password: 'Mo12dsa@3*313kj' })
			.expect(400)
			.then((res) => {
				expect(res.body.validation.body.keys[0]).toEqual('email');
				done();
			});
	});

	it('should login successfully', (done) => {
		const user = { email: 'test@test.com', password: 'SomePasswOR#!1)' };
		// register a user
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: user.email.toUpperCase(), password: user.password })
			.expect(201)
			.then(() => {
				// attempt to login
				request(app)
					.post('/auth/login')
					.set('Accept', 'application/json')
					.send({ email: user.email, password: user.password })
					.expect(200, done);
			});
	});
});

describe('POST: /auth/forget-password', () => {
	it('should fail with no user found with this user', (done) => {
		request(app)
			.post('/auth/forget-password')
			.set('Accept', 'application/json')
			.send({ email: 'moasdasd@mail.com' })
			.expect(404, done);
	});

	it('should fail wrong email format', (done) => {
		request(app)
			.post('/auth/forget-password')
			.set('Accept', 'application/json')
			.send({ email: 'moasdasdm@ailcom' })
			.expect(400, done);
	});

	// temporary skip this - because i don't wan't send email every time
	it('should pass and send reset-password email', (done) => {
		const user = { email: 'mmdfrn81@gmail.com', password: 'M1mm@$asdkvkaK' };
		// first register a user
		request(app)
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({ email: user.email, password: user.password })
			.expect(201)
			.then(() => {
				request(app)
					.post('/auth/forget-password')
					.set('Accept', 'application/json')
					.send({ email: user.email })
					.expect(200, done);
			});
	});
});

describe('POST: /auth/reset-password', () => {
	it('should fail no token available', (done) => {
		request(app)
			.post('/auth/reset-password')
			.set('Accept', 'application/json')
			.send({ password: 'asdasjdaksdj' })
			.expect(400, done);
	});

	it('should fail wrong token', (done) => {
		const token = '111a3257eaa7f80321991eb68112625f171155df67dfa0c27ad63257';
		request(app)
			.post('/auth/reset-password')
			.set('Accept', 'application/json')
			.send({ token, password: 'adjaksdjM0-67%^8%' })
			.expect(400, done);
	});
});

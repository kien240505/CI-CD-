const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');
const db = require('../db');

// Setup mock express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth API Endpoints', () => {
  beforeAll((done) => {
    // Clear users table before testing
    db.run('DELETE FROM users', done);
  });

  afterAll((done) => {
    db.close(done);
  });

  let testUser = {
    fullname: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBeDefined();
  });

  it('should login user and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBeDefined();
  });

  it('should mock forgot password', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUser.email });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.resetToken).toBeDefined();
  });
});

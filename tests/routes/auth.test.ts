// Mock env values before module import
jest.mock('../../src/utils/env', () => ({ __esModule: true, default: (key: string) => {
  if (key === 'GOOGLE_CLIENT_ID') return 'G-ID';
  if (key === 'JWT_SECRET') return 'SECRET';
  if (key === 'ALLOWED_DOMAIN') return 'domain.com';
  return '';
}}));

// Mock google-auth-library
const verifyMock = jest.fn();
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn(() => ({ verifyIdToken: verifyMock })),
}));

jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'signed.jwt') }));

import express from 'express';
import request from 'supertest';

import createAuthRouter from '../../src/routes/auth';

describe('POST /api/auth/google', () => {
  let app: any;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api', createAuthRouter());
  });

  test('returns 400 if missing idToken', async () => {
    const res = await request(app).post('/api/google').send({}).expect(400);
    expect(res.body.error).toMatch(/Missing idToken/);
  });

  test('returns 401 if verifyIdToken returns null payload', async () => {
    verifyMock.mockResolvedValue({ getPayload: () => null });
    const res = await request(app).post('/api/google').send({ idToken: 't' }).expect(401);
    expect(res.body.error).toMatch(/Invalid Google payload/);
  });

  test('returns 401 if email missing or not verified', async () => {
    verifyMock.mockResolvedValue({ getPayload: () => ({ email: null, email_verified: false }) });
    const res = await request(app).post('/api/google').send({ idToken: 't' }).expect(401);
  });

  test('returns 403 if domain not allowed', async () => {
    verifyMock.mockResolvedValue({ getPayload: () => ({ email: 'user@other.com', email_verified: true }) });
    const res = await request(app).post('/api/google').send({ idToken: 't' }).expect(403);
  });

  test('returns token when success', async () => {
    verifyMock.mockResolvedValue({ getPayload: () => ({ email: 'user@domain.com', email_verified: true, name: 'Name', picture: 'pic', sub: 'sub' }) });
    const res = await request(app).post('/api/google').send({ idToken: 't' }).expect(200);
    expect(res.body.token).toEqual('signed.jwt');
    expect(res.body.user.email).toEqual('user@domain.com');
  });
});

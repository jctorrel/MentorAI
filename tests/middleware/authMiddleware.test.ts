
// Force JWT_SECRET via env mock before requiring the module
jest.mock('../../src/utils/env', () => ({ __esModule: true, default: (key: string) => key === 'JWT_SECRET' ? 'secret' : '' }));

import jwt from 'jsonwebtoken';
import { requireAuth, AuthRequest } from '../../src/middleware/authMiddleware';

describe('requireAuth middleware', () => {
  const next = jest.fn();
  const res: any = { status: jest.fn(() => res), json: jest.fn(() => res) };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 401 when no header', () => {
    const req = { headers: {} } as any;
    requireAuth(req as AuthRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when header malformed', () => {
    const req = { headers: { authorization: 'BadToken' } } as any;
    requireAuth(req as AuthRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('calls next when token valid', () => {
    const payload = { sub: '1', email: 'a@x' };
    jest.spyOn(jwt, 'verify' as any).mockImplementation(() => payload as any);
    const req = { headers: { authorization: 'Bearer token123' } } as any;
    requireAuth(req as AuthRequest, res, next);
    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual(payload);
  });

  test('returns token_expired on expired token', () => {
    const err: any = new Error('expired');
    err.name = 'TokenExpiredError';
    jest.spyOn(jwt, 'verify' as any).mockImplementation(() => { throw err; });
    const req = { headers: { authorization: 'Bearer token123' } } as any;
    requireAuth(req as AuthRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'token_expired' });
  });

  test('returns 401 when jwt.verify throws invalid token', () => {
    jest.spyOn(jwt, 'verify' as any).mockImplementation(() => { throw new Error('bad'); });
    const req = { headers: { authorization: 'Bearer token123' } } as any;
    requireAuth(req as AuthRequest, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});

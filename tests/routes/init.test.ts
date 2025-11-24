import express from 'express';
import request from 'supertest';

import createInitRouter from '../../src/routes/init';

const app = express();
app.use('/api', createInitRouter());

describe('GET /health', () => {
  it('devrait répondre 200 avec le statut ok', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(typeof res.body.time).toBe('string');
    expect(() => new Date(res.body.time).toISOString()).not.toThrow();
  });
});
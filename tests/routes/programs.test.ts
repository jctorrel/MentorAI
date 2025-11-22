import express from 'express';
import request from 'supertest';

import createProgramsRouter from '../../src/routes/programs';

const app = express();
app.use('/api', createProgramsRouter());

describe('GET /programs', () => {
  it('devrait répondre 200 avec le statut ok', async () => {
    const res = await request(app)
      .get('/api/programs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(typeof res.body.time).toBe('string');
    expect(() => new Date(res.body.time).toISOString()).not.toThrow();
  });
});
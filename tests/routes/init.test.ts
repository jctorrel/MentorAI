// tests/routes/init.test.ts
import express from 'express';
import request from 'supertest';

import type { Programs } from "../../src/utils/programs";
import { getActiveModules } from '../../src/utils/programs';
import createInitRouter from '../../src/routes/init';

const fakePrograms: Programs = {
    A1: {
        objectives: "Objectif du programme A1",
        label: "Titre du programme A1",
        level: "Niveau du programme A1",
        modules: [
            {
                id: "module-1",
                label: "Module 1",
                start_month: 1,
                end_month: 12,
                content: ["Sujet M1-1", "Sujet M1-2"],
            },
            {
                id: "module-2",
                label: "Module 2",
                start_month: 12,
                end_month: 8,
                content: ["Sujet M2-1", "Sujet M2-2"],
            }
      ]
    }
};
const fakeProgramID = "A1";

const app = express();
app.use(express.json());
app.use('/api', createInitRouter(fakePrograms));

describe('POST /init', () => {
    it('devrait répondre 200 avec le statut ok', async () => {
        const res = await request(app)
            .post('/api/init')
            .send({ programID: fakeProgramID })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.modules).toStrictEqual(getActiveModules(fakePrograms, fakeProgramID));
    });
});

it("devrait répondre 400 si programID est manquant", async () => {
    const res = await request(app)
        .post('/api/init')
        .send({})
        .expect(400);

    expect(res.body.reply).toBe("programID est requis.");
});
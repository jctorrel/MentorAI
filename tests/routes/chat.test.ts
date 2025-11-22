// __tests__/chat.route.test.ts
import express from "express";
import request from "supertest";

import createChatRouter from "../../src/routes/chat";

// on mock la DB
jest.mock("../../src/db/summaries", () => ({
  getStudentSummary: jest.fn().mockResolvedValue(null),
  createStudentSummary: jest.fn().mockResolvedValue(undefined),
}));

// on mock le render
jest.mock("../../src/utils/prompts", () => ({
  render: jest.fn((_tpl, ctx) => `SYSTEM PROMPT FOR ${ctx.email}`),
}));

import { getStudentSummary, createStudentSummary } from "../../src/db/summaries";
import { render } from "../../src/utils/prompts";

const fakeOpenAI = {
  responses: {
    create: jest.fn().mockResolvedValue({
      output_text: " Salut étudiant !  ",
    }),
  },
} as any;

const app = express();
app.use(express.json());

const deps = {
  openai: fakeOpenAI,
  mentorSystemTemplate: "MENTOR_TEMPLATE",
  summarySystemTemplate: "SUMMARY_TEMPLATE",
  mentorConfig: {
    school_name: "Test School",
    tone: "amical",
    rules: "Règles",
  },
  programs: {
    "program-1": { id: "program-1", name: "Programme 1" },
  },
  mentorModel: "osef-model",
};

app.use("/api", createChatRouter(deps));

describe("POST /api/chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retourne 200 et une réponse du mentor", async () => {
    const payload = {
      email: "eleve@test.com",
      message: "Bonjour le mentor",
      programID: "program-1",
    };

    const res = await request(app)
      .post("/api/chat")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(200);

    // Réponse HTTP
    expect(res.body).toEqual({ mentorReply: "Salut étudiant !" });

    // OpenAI a été appelé correctement
    expect(fakeOpenAI.responses.create).toHaveBeenCalledTimes(1);
    expect(fakeOpenAI.responses.create).toHaveBeenCalledWith({
      model: expect.any(String),
      instructions: expect.stringContaining("eleve@test.com"),
      input: "Bonjour le mentor",
    });

    // On a appelé getStudentSummary / createStudentSummary
    expect(getStudentSummary).toHaveBeenCalledWith("eleve@test.com");
    expect(createStudentSummary).toHaveBeenCalledWith(
      deps.summarySystemTemplate,
      "eleve@test.com",
      "Bonjour le mentor",
      "Salut étudiant !"
    );

    // Et le render a bien été utilisé
    expect(render).toHaveBeenCalled();
  });

    it("retourne 400 si un champ est manquant", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ email: "test@test.com" }) // message + programID manquent
      .expect(400);

    expect(res.body.reply).toMatch(/requis/);
    expect(fakeOpenAI.responses.create).not.toHaveBeenCalled();
  });
});

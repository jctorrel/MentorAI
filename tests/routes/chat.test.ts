import express from "express";
import request from "supertest";

// 1) Mock auth
jest.mock("../../src/middleware/authMiddleware", () => ({
  requireAuth: (_req: any, _res: any, next: any) => next(),
}));

// 2) Mock getEnv (pour MENTOR_MODEL)
jest.mock("../../src/utils/env", () => ({
  __esModule: true,
  default: (key: string) => {
    if (key === "MENTOR_MODEL") return "osef-model";
    return "";
  },
}));

// 3) Mock summaries
jest.mock("../../src/db/summaries", () => ({
  getStudentSummary: jest.fn().mockResolvedValue(null),
  createStudentSummary: jest.fn().mockResolvedValue(undefined),
}));

// 4) Mock render
jest.mock("../../src/utils/prompts", () => {
  const actual = jest.requireActual("../../src/utils/prompts");
  return {
    __esModule: true,
    ...actual,
    default: jest.fn((_tpl: string, ctx: any) => `SYSTEM PROMPT FOR ${ctx.email}`),
  };
});

// 5) 🔥 Mock PROGRAM PROMPT → évite tout accès à Mongo
jest.mock("../../src/utils/programs", () => ({
  getProgramPrompt: jest.fn().mockReturnValue("PROGRAM PROMPT"),
}));

// --------------------------------------------------------------------
import createChatRouter from "../../src/routes/chat";
import { getStudentSummary, createStudentSummary } from "../../src/db/summaries";
import render from "../../src/utils/prompts";

// --------------------------------------------------------------------
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
    A1: {
      object: "Objectif du programme A1",
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
        },
      ],
    },
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
      programID: "A1",
    };

    const res = await request(app)
      .post("/api/chat")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual({ mentorReply: "Salut étudiant !" });

    expect(fakeOpenAI.responses.create).toHaveBeenCalledTimes(1);

    expect(fakeOpenAI.responses.create).toHaveBeenCalledWith({
      model: expect.any(String),
      instructions: expect.stringContaining("eleve@test.com"),
      input: "Bonjour le mentor",
    });

    expect(getStudentSummary).toHaveBeenCalledWith("eleve@test.com");
    expect(createStudentSummary).toHaveBeenCalledWith(
      deps.summarySystemTemplate,
      "eleve@test.com",
      "Bonjour le mentor",
      "Salut étudiant !"
    );

    expect(render).toHaveBeenCalled();
  });

  it("retourne 400 si un champ est manquant", async () => {
    const res = await request(app)
      .post("/api/chat")
      .send({ email: "test@test.com" })
      .expect(400);

    expect(res.body.reply).toMatch(/requis/i);
    expect(fakeOpenAI.responses.create).not.toHaveBeenCalled();
  });
});

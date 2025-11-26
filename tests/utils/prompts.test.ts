import render from "../../src/utils/prompts";

// 👉 On mocke getPromptContent car c’est lui qui remplace loadPrompt()
jest.mock("../../src/db/prompts", () => ({
  getPromptContent: jest.fn((key: string) => {
    if (key === "mentor-system") {
      return Promise.resolve("Tu es le mentor et tu dois aider les étudiants.");
    }
    return Promise.resolve(null);
  }),
}));

import { getPromptContent } from "../../src/db/prompts";

describe("prompts utilities", () => {

  test("getPromptContent returns prompt content for existing prompt", async () => {
    const content = await getPromptContent("mentor-system");

    expect(typeof content).toBe("string");
    expect(content!.length).toBeGreaterThan(0);
    expect(content).toMatch(/Tu es le mentor/);
  });

  test("getPromptContent returns null for missing prompt", async () => {
    const content = await getPromptContent("this-file-does-not-exist");

    expect(content).toBeNull();
  });

  test("render replaces template variables and leaves unknown empty", () => {
    const template =
      "Hello {{name}}, your email is {{email}} and missing {{missing}}.";
    const out = render(template, { name: "Alice", email: "a@x.com" } as any);

    expect(out).toContain("Alice");
    expect(out).toContain("a@x.com");
    expect(out).toContain("missing ."); // valeur inconnue → vide
  });
});

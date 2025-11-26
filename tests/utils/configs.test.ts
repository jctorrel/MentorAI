// tests/utils/config.test.ts

jest.mock("../../src/db/config", () => ({
  getMentorConfig: jest.fn(),
}));

import { getMentorConfig } from "../../src/db/config";

describe("getMentorConfig", () => {
  
  test("returns mentor config from DB", async () => {
    // 👉 on simule un document valide
    (getMentorConfig as jest.Mock).mockResolvedValue({
      school_name: "Normandie Web School",
      tone: "concis, professionnel",
      rules: "jamais quitter école, réponse courte",
    });

    const cfg = await getMentorConfig();

    expect(cfg).toBeDefined();
    expect(cfg.school_name).toBe("Normandie Web School");
    expect(cfg.tone).toContain("concis");
  });

  test("returns empty object when config is missing", async () => {
    // 👉 on simule l'absence de document dans Mongo
    (getMentorConfig as jest.Mock).mockResolvedValue(null);

    const cfg = await getMentorConfig();

    expect(cfg).toBeNull(); // comportement normal de ton helper
  });
});

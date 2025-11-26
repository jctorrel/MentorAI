// tests/client/MentorChatApp.test.js

import { describe, it, expect } from 'vitest';
import { buildInitMessage } from "../src/components/MentorChatApp.jsx";

describe("buildInitMessage", () => {
    it("génère un message correct à partir de modules", () => {
        const modules = [
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
        ];

        const msg = buildInitMessage(modules);

        // Le message de base doit être présent
        expect(msg).toContain("Bonjour");

        // Modules
        expect(msg).toContain("Module 1");
        expect(msg).toContain("Module 2");

        // Contenus
        expect(msg).toContain("Sujet M2-1");
        expect(msg).toContain("Sujet M2-2");

        // Deadlines
        expect(msg).toContain("À faire avant fin août");
        expect(msg).toContain("À faire avant fin décembre");
    });

    it("retourne le message par défaut si modules est vide", () => {
        const msg = buildInitMessage([]);
        expect(msg).toContain("Bonjour"); // le message par défaut
    });

    it("retourne le message par défaut si modules n'est pas un tableau", () => {
        const msg1 = buildInitMessage(null);
        const msg2 = buildInitMessage(undefined);
        const msg3 = buildInitMessage({});

        expect(msg1).toContain("Bonjour");
        expect(msg2).toContain("Bonjour");
        expect(msg3).toContain("Bonjour");
    });
});
// src/utils/programs.ts
import { logger } from "./logger";
import { loadPrompt, render } from "./prompts";

export type ProgramModule = {
    id: string;
    label: string;
    start_month: number;
    end_month: number;
    content: string[];
};

export type Program = {
    objectives: string;
    level: string;
    label: string;
    modules: ProgramModule[];
};

export type Programs = Record<string, Program>;

export function getActiveModules(programs: Programs, programID: string, date: Date = new Date()): ProgramModule[] {
    const program: Program = programs[programID];
    if (!program || !Array.isArray(program.modules)) {
        logger.error(`❌ Programme introuvable ou invalide pour l'ID : ${programID}`);
        return [];
    }

    const currentMonth = date.getMonth() + 1; // JS: 0 = janvier → +1

    return program.modules.filter((module) => {
        const start = module.start_month;
        const end = module.end_month;

        // cas normal (ex: 9 → 11)
        if (start <= end) {
            return currentMonth >= start && currentMonth <= end;
        }

        // cas chevauchement d’année (ex: 9 → 8)
        // ex : actif si (m >= 9) ou (m <= 8)
        return currentMonth >= start || currentMonth <= end;
    });
}

export function getProgramPrompt(programs: Programs, programID: string, date: Date = new Date()) {
    const programPromptTemplate: string = loadPrompt("program.txt");
    const modules: ProgramModule[] = getActiveModules(programs, programID, date);

    return render(programPromptTemplate, {
        "program_label": programs[programID].label,
        "program_objective": programs[programID].objectives,
        "program_level": programs[programID].level,
        "program_modules": modules.map((module) => `- ${module.label} : ${module.content.join(", ")}`).join("\n")
    });
};
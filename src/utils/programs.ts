// src/utils/programs.ts
import { logger } from "./logger";
import { loadPrompt, render } from "./prompts";

type ProgramModule = {
    id: string;
    label: string;
    start_month: number;
    end_month: number;
    content: string[];
};

type Program = {
    object: string;
    level: string;
    label: string;
    modules: ProgramModule[];
};

type Programs = Record<string, Program>;

function getActiveModules(programs: Programs, programID: string, date: Date = new Date()): ProgramModule[] {
    const program = programs[programID];
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

export default function getProgramPrompt(programs: Programs, programID: string, date: Date = new Date()) {
    const programPromptTemplate = loadPrompt("program.txt");
    const modules = getActiveModules(programs, programID, date);

    return render(programPromptTemplate, {
        "program_label": programs[programID].label,
        "program_objective": programs[programID].object,
        "program_level": programs[programID].level,
        "program_modules": modules.map((module) => `- ${module.label} : ${module.content.join(", ")}`).join("\n")
    });
};
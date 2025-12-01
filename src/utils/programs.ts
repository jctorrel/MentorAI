// src/utils/programs.ts
import { logger } from "./logger";
import render from "./prompts";
import { getPromptContent } from "../db/prompts";
import getEnv from "./env";
import { getProgram } from "../db/programs";

export type ProgramModule = {
  id: string;
  label: string;
  start_month: number;
  end_month: number;
  content: string[];
};

export type Program = {
  key: string;
  objectives: string;
  level: string;
  label: string;
  resources: string[];
  modules: ProgramModule[];
};

export type Programs = Record<string, Program>;

const programsPromptTemplate = getEnv("PROGRAMS_PROMPT_TEMPLATE");

export async function getActiveModules(
  program: Program,
  date: Date = new Date()
): Promise<ProgramModule[]> {
  const currentMonth = date.getMonth() + 1; // JS: 0 = janvier → +1

  return program.modules.filter((module) => {
    const start = module.start_month;
    const end = module.end_month;

    // cas normal (ex: 9 → 11)
    if (start <= end) {
      return currentMonth >= start && currentMonth <= end;
    }

    // cas chevauchement d’année (ex: 9 → 8)
    return currentMonth >= start || currentMonth <= end;
  });
}

export async function getProgramPrompt(
  programID: string,
  date: Date = new Date()
): Promise<string> {
  const program = await getProgram(programID);

  if (!program || !Array.isArray(program.modules)) {
    logger.error(`Programme introuvable ou invalide pour l'ID : ${programID}`);
    return "";
  }

  const programSystemTemplate: string | null = await getPromptContent(
    programsPromptTemplate
  );
  const modules: ProgramModule[] = await getActiveModules(program, date);

  if (!programSystemTemplate) {
    logger.error(`Prompt programme introuvable pour la clé : ${programsPromptTemplate}`);
    throw new Error(`Prompt programme introuvable pour la clé : ${programsPromptTemplate}`);
  }

  return render(programSystemTemplate, {
    program_label: program.label,
    program_objective: program.objectives,
    program_level: program.level,
    program_resources: program.resources.join(", "),
    program_modules: modules
      .map((module) => `- ${module.label} : ${module.content.join(", ")}`)
      .join("\n"),
  });
}

import type { AnswerSection } from "./types";
import type { Locale } from "./i18n";
import ru from "./data/answers.ru.json";
import en from "./data/answers.en.json";
import uz from "./data/answers.uz.json";

const ANSWERS: Record<Locale, AnswerSection[]> = {
  ru: ru as AnswerSection[],
  en: en as AnswerSection[],
  uz: uz as AnswerSection[],
};

export function getAnswers(locale: Locale): AnswerSection[] {
  return ANSWERS[locale];
}

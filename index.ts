import type { Address, Agent, Language, HolochainLanguageDelegate, LanguageContext, Interaction, ExpressionUI } from "@perspect3vism/ad4m";
import LangAdapter from "./languageAdapter";
import { DNA, DNA_NICK } from "./dna";
import Adapter from "./adapter";

export const name = "languages";

function interactions(expression: Address): Interaction[] {
  return [];
}

export default async function create(context: LanguageContext): Promise<Language> {
  const Holochain = context.Holochain as HolochainLanguageDelegate;
  await Holochain.registerDNAs([{ file: DNA, nick: DNA_NICK }]);

  const expressionAdapter = new Adapter(context);
  const languageAdapter = new LangAdapter(context);

  return {
    name,
    expressionAdapter,
    languageAdapter,
    interactions,
  } as Language;
}

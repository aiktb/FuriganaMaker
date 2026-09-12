export const languageOptions: LanguageModelCreateCoreOptions = {
  expectedInputs: [{ type: "text", languages: ["en", "ja"] }],
  expectedOutputs: [{ type: "text", languages: ["ja"] }],
};

export function getLanguageModel(): typeof LanguageModel | undefined {
  // Type declarations do not imply runtime support (notably in Firefox).
  if (typeof LanguageModel === "undefined") {
    return undefined;
  }
  return typeof LanguageModel.availability === "function" &&
    typeof LanguageModel.create === "function"
    ? LanguageModel
    : undefined;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { toHiragana } from "wanakana";
import { aiResponseConstraint, aiSystemPrompt, getAiKanjiTokens } from "@/core/aiFurigana";
import { type FuriganaSegment, getFuriganaSegments } from "./components/JapaneseTextarea";
import { getLanguageModel, languageOptions } from "./languageModel";

export function useAiFurigana() {
  const [availability, setAvailability] = useState<
    Availability | "checking" | "unsupported" | "error"
  >("checking");
  const [phase, setPhase] = useState<"idle" | "preparing" | "generating">("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FuriganaSegment[] | null>(null);
  const template = useRef<LanguageModel | null>(null);
  const operation = useRef<AbortController | null>(null);
  const checkId = useRef(0);

  const check = useCallback(async () => {
    const id = ++checkId.current;
    const api = getLanguageModel();
    if (!api) {
      setAvailability("unsupported");
      return;
    }
    setAvailability("checking");
    try {
      const state = await api.availability(languageOptions);
      if (id === checkId.current) {
        setAvailability(state);
      }
    } catch {
      if (id === checkId.current) {
        setAvailability("error");
      }
    }
  }, []);

  useEffect(() => {
    check();
    return () => {
      checkId.current++;
      operation.current?.abort();
      operation.current = null;
      template.current?.destroy();
      template.current = null;
    };
  }, [check]);

  const stop = useCallback(() => {
    operation.current?.abort();
    operation.current = null;
    template.current?.destroy();
    template.current = null;
    setPhase("idle");
    setProgress(null);
  }, []);

  const reset = useCallback(() => {
    // Editing text only cancels inference; a model download can continue.
    if (phase === "generating") {
      stop();
    }
    setResult(null);
    setError(null);
  }, [phase, stop]);

  const getTemplate = async (
    api: NonNullable<ReturnType<typeof getLanguageModel>>,
    signal: AbortSignal,
  ) => {
    if (template.current) {
      return template.current;
    }
    // Called directly from a click, before any await, to preserve activation.
    const created = await api.create({
      ...languageOptions,
      initialPrompts: [{ role: "system", content: aiSystemPrompt }],
      signal,
      monitor(monitor) {
        monitor.addEventListener("downloadprogress", ({ loaded }) => {
          if (!signal.aborted && Number.isFinite(loaded)) {
            setProgress(Math.round(Math.max(0, Math.min(1, loaded)) * 100));
          }
        });
      },
    });
    if (signal.aborted) {
      created.destroy();
      signal.throwIfAborted();
    }
    template.current = created;
    return created;
  };

  const run = async (text?: string) => {
    const api = getLanguageModel();
    if (!api || operation.current) {
      return;
    }
    checkId.current++;
    const controller = new AbortController();
    operation.current = controller;
    const current = () => operation.current === controller && !controller.signal.aborted;
    setError(null);
    setProgress(null);
    const initial = getOperationState(text);
    setPhase(initial.phase);
    let session: LanguageModel | undefined;
    let errorKey = initial.error;
    try {
      const base = await getTemplate(api, controller.signal);
      controller.signal.throwIfAborted();
      setAvailability("available");
      setProgress(null);
      if (text !== undefined) {
        session = await base.clone({ signal: controller.signal });
        controller.signal.throwIfAborted();
        const response = await session.prompt(JSON.stringify(text), {
          signal: controller.signal,
          responseConstraint: aiResponseConstraint,
        });
        controller.signal.throwIfAborted();
        errorKey = "aiErrorOutput";
        const segments = toSegments(response, text);
        setResult(segments);
      }
    } catch (cause) {
      if (current()) {
        setError(getErrorKey(cause, errorKey));
        template.current?.destroy();
        template.current = null;
      }
    } finally {
      session?.destroy();
      if (current()) {
        operation.current = null;
        setPhase("idle");
        setProgress(null);
      }
    }
  };

  return { availability, phase, progress, error, result, check, stop, reset, run };
}

function getErrorKey(cause: unknown, fallback: string) {
  return cause instanceof DOMException && cause.name === "QuotaExceededError"
    ? "aiErrorQuota"
    : fallback;
}

function toSegments(response: string, text: string): FuriganaSegment[] {
  const tokens = getAiKanjiTokens(response, text).map((token) => ({
    ...token,
    reading: toHiragana(token.reading),
  }));
  return getFuriganaSegments(tokens, text);
}

function getOperationState(text?: string) {
  return text === undefined
    ? { phase: "preparing" as const, error: "aiErrorSetup" }
    : { phase: "generating" as const, error: "aiErrorGenerate" };
}

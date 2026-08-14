import type { GeneratedFormDraft } from "@/types/form";

export type CreationCanvasState = "brief" | "generating" | "complete";

export function getCreationCanvasState({
  generated,
  isGenerating,
}: {
  generated: GeneratedFormDraft | null;
  isGenerating: boolean;
}): CreationCanvasState {
  if (generated) return "complete";
  return isGenerating ? "generating" : "brief";
}

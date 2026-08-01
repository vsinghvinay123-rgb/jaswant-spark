import { supabase } from "@/integrations/supabase/client";

/**
 * Detects whether the user is asking for an image to be generated.
 * Supports English, Hindi and Hinglish phrasing.
 */
const IMAGE_INTENT = new RegExp(
  [
    "\\b(draw|sketch|paint|illustrate|render)\\b",
    "\\b(generate|create|make|design|show me)\\s+(an?\\s+)?(image|picture|photo|poster|logo|wallpaper|artwork|illustration|banner)",
    "\\b(image|picture|photo)\\s+(of|for)\\b",
    "(chitra|tasveer|photo|image)\\s*(banao|bana do|banade|banaiye|dikhao)",
    "(बनाओ|बना दो|चित्र|तस्वीर बनाओ)",
  ].join("|"),
  "i",
);

export function isImageRequest(text: string): boolean {
  return IMAGE_INTENT.test(text);
}

/** Strips the command words so the model gets a clean subject prompt. */
export function extractImagePrompt(text: string): string {
  return (
    text
      .replace(
        /^(please\s+)?(can you\s+|could you\s+)?(draw|sketch|paint|illustrate|render|generate|create|make|design|show me)\s+(me\s+)?(an?\s+|the\s+)?(image|picture|photo|poster|logo|wallpaper|artwork|illustration|banner)?\s*(of|for)?\s*/i,
        "",
      )
      .replace(/\b(ka|ki)?\s*(chitra|tasveer)\s*(banao|bana do|banade|banaiye|dikhao)\b/gi, "")
      .trim() || text.trim()
  );
}

export interface ImageResult {
  imageUrl?: string;
  error?: string;
}

export async function generateImage(prompt: string): Promise<ImageResult> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: { prompt },
    });
    if (error) {
      return { error: error.message || "Image generation failed." };
    }
    if (data?.error) return { error: data.error as string };
    if (!data?.imageUrl) return { error: "No image was generated." };
    return { imageUrl: data.imageUrl as string };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image generation failed." };
  }
}

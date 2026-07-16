import { auth, defineMcp } from "@lovable.dev/mcp-js";
import askFasalDoctor from "./tools/ask_fasal_doctor";

// Build the OAuth issuer from the Supabase project ref (Vite inlines this at build time).
// Never derive from SUPABASE_URL — on Lovable Cloud that's a proxy host and token
// verification would fail against the direct supabase.co issuer.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "bharat-ai-fasal-doctor",
  title: "Bharat AI · Fasal Doctor",
  version: "0.1.0",
  instructions:
    "Bharat AI - an Indian agriculture assistant by Jaswant. Use `ask_fasal_doctor` to get structured ICAR-standard crop diagnosis, pest / disease prescriptions, mandi rate guidance, irrigation and fertilizer advice in English, Hindi, Hinglish or Marwadi.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [askFasalDoctor],
});

import { useState } from "react";

// Updated interface to match the new comprehensive brand identity structure
interface BrandIdentity {
  business_name: string;
  tagline: string;
  brand_description: string;
  mission_statement?: string;
  core_values?: string[];
  color_palette?: Array<{
    name: string;
    hex: string;
    usage: string;
  }>;
  design_style?: string;
  typography?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  target_audience?: {
    primary?: string;
    secondary?: string;
  };
  brand_personality?: {
    traits?: string[];
    tone_of_voice?: string;
  };
  logo_direction?: {
    concept?: string;
    symbolism?: string;
    style_notes?: string;
  };
}

interface GenerationState {
  brand: BrandIdentity | null;
  logoPng: string | null;
  logoVariations?: any; // Add this for logo variations
  projectId: string | null;
  status: "idle" | "generating_brand" | "generating_logo" | "complete" | "error";
  error: string | null;
}

export function useLogoGeneration() {
  const [state, setState] = useState<GenerationState>({
    brand: null,
    logoPng: null,
    logoVariations: null,
    projectId: null,
    status: "idle",
    error: null,
  });

  const generateLogo = async (
    businessName: string,
    style: string,
    industry: string,
    description: string,
    userId?: string
  ) => {
    setState((prev) => ({ ...prev, status: "generating_brand", error: null }));

    try {
      // Step 1: Generate Enhanced Brand Identity
      console.log("Step 1: Generating comprehensive brand identity...");
      const brandResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          style,
          industry,
          description,
          userId,
        }),
      });

      if (!brandResponse.ok) {
        const errorText = await brandResponse.text();
        throw new Error(`Brand generation failed: ${errorText}`);
      }

      const brandResult = await brandResponse.json();
      console.log("Enhanced brand identity generated:", brandResult);

      setState((prev) => ({
        ...prev,
        brand: brandResult.data,
        projectId: brandResult.data?.project_id || null,
        status: "generating_logo",
      }));

      // Step 2: Generate Multiple Logo Variations
      console.log("Step 2: Generating logo variations...");
      const logoResponse = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandData: brandResult.data,
          projectId: brandResult.data?.project_id,
        }),
      });

      if (!logoResponse.ok) {
        const errorData = await logoResponse.json();
        throw new Error(errorData.error || "Logo generation failed");
      }

      const logoResult = await logoResponse.json();
      console.log("Logo variations result:", logoResult);

      setState((prev) => ({
        ...prev,
        logoPng: logoResult.data?.primary_logo || logoResult.data?.logo_variations?.primary?.logo_png,
        logoVariations: logoResult.data?.logo_variations,
        status: "complete",
      }));
    } catch (error) {
      console.error("Generation pipeline error:", error);
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Generation failed",
      }));
    }
  };

  const reset = () => {
    setState({
      brand: null,
      logoPng: null,
      logoVariations: null,
      projectId: null,
      status: "idle",
      error: null,
    });
  };

  return {
    ...state,
    generateLogo,
    reset,
    loading: state.status === "generating_brand" || state.status === "generating_logo",
  };
}
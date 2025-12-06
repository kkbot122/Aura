import { NextRequest, NextResponse } from "next/server";
import { cloudflareAI } from "@/lib/api-clients";

// Define proper types for logo variations
interface LogoVariation {
  name: string;
  prompt: string;
}

interface LogoResult {
  logo_png: string;
  prompt: string;
  colors_used: {
    primary: string;
    accent: string;
  };
}

interface LogoResults {
  [key: string]: LogoResult;
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    console.log("Enhanced logo generation request received");

    const { brandData, projectId } = body;

    if (!brandData) {
      return NextResponse.json(
        { error: "Missing brand data" },
        { status: 400 }
      );
    }

    // Extract brand colors and typography for logo prompts
    const brandColors = brandData.color_palette || [];
    const primaryColor =
      brandColors.find((c: any) => c.name.toLowerCase().includes("primary"))
        ?.hex || "#3B82F6";
    const accentColor =
      brandColors.find((c: any) => c.name.toLowerCase().includes("accent"))
        ?.hex || "#10B981";

    const typography = brandData.typography || {};
    const fontStyle = typography.primary?.characteristics || "clean and modern";

    const logoDirection = brandData.logo_direction || {};

    const aiPrompts = logoDirection.ai_prompts || {};
    // Create color-aware logo prompts
    const logoVariations = [
      {
        name: "primary",
        prompt:
          aiPrompts.primary ||
          `professional minimalist logo for ${brandData.business_name}, 
            ${brandData.design_style} style, 
            primary color: ${primaryColor},
            accent color: ${accentColor},
            ${logoDirection.concept || "clean and professional"},
            clean vector design, white background, no text, icon only`,
      },
      {
        name: "monochrome",
        prompt:
          aiPrompts.monochrome ||
          `monochrome logo for ${brandData.business_name} in ${primaryColor},
            ${brandData.design_style} style,
            single color logo, white background,
            ${logoDirection.symbolism || "simple and clean"},
            vector design, professional, no text`,
      },
      {
        name: "icon",
        prompt:
          aiPrompts.icon ||
          `app icon logo for ${brandData.business_name},
            using colors ${primaryColor} and ${accentColor},
            ${brandData.design_style} style,
            ${logoDirection.symbolism || "simple symbol"},
            square format, clean vector, white background,
            minimalist icon, scalable design, no text`,
      },
    ];

    console.log("Generating color-aware logo variations...");
    console.log("Using primary color:", primaryColor);
    console.log("Using accent color:", accentColor);

    const logoResults: LogoResults = {};

    for (const variation of logoVariations) {
      try {
        // Use fast generation for all variations
        const logoImageBase64 = await cloudflareAI.generateLogoWithStyle(
          variation.prompt,
          brandData.design_style || "minimalist"
        );

        if (logoImageBase64) {
          logoResults[variation.name] = {
            logo_png: `data:image/png;base64,${logoImageBase64}`,
            prompt: variation.prompt,
            colors_used: {
              primary: primaryColor,
              accent: accentColor,
            },
          };
          console.log(`✅ Generated ${variation.name} logo using brand colors`);
        }
      } catch (variationError) {
        console.error(
          `Failed to generate ${variation.name} logo:`,
          variationError
        );
        // Continue with other variations
      }
    }

    console.log("Color-aware logo variations generation completed");

    // Get the first logo as primary if primary doesn't exist
    const primaryLogo =
      logoResults.primary?.logo_png ||
      Object.values(logoResults)[0]?.logo_png ||
      null;

    return NextResponse.json({
      success: true,
      data: {
        logo_variations: logoResults,
        primary_logo: primaryLogo,
        colors_used: {
          primary: primaryColor,
          accent: accentColor,
          palette: brandColors,
        },
        typography_used: typography,
      },
    });
  } catch (error) {
    console.error("Enhanced logo generation error:", error);

    // Fallback to simpler generation
    try {
      // Access brandData from the outer scope (we still have access to the original body)
      const fallbackPrompt = `minimalist logo for ${
        body.brandData?.business_name || "business"
      }, clean vector design, white background`;
      const fallbackLogo = await cloudflareAI.generateFastLogo(fallbackPrompt);

      const fallbackResults: LogoResults = {
        primary: {
          logo_png: `data:image/png;base64,${fallbackLogo}`,
          prompt: fallbackPrompt,
          colors_used: {
            primary: "#3B82F6",
            accent: "#10B981",
          },
        },
      };

      return NextResponse.json({
        success: true,
        data: {
          logo_variations: fallbackResults,
          primary_logo: fallbackResults.primary.logo_png,
        },
      });
    } catch (fallbackError) {
      console.error("Fallback generation also failed:", fallbackError);
      return NextResponse.json(
        {
          success: false,
          error: "Logo generation failed completely",
        },
        { status: 500 }
      );
    }
  }
}

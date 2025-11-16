import { NextRequest, NextResponse } from 'next/server';
import { cloudflareAI } from '@/lib/api-clients';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Enhanced logo generation request received');

    const { brandData, projectId } = body;

    if (!brandData) {
      return NextResponse.json(
        { error: 'Missing brand data' },
        { status: 400 }
      );
    }

    // Generate multiple logo variations
    const logoVariations = [
      {
        name: "primary",
        prompt: `minimalist professional logo for ${brandData.business_name}, ${brandData.design_style} style, ${brandData.logo_direction.concept}, clean vector design, white background, professional business logo`
      },
      {
        name: "monochrome", 
        prompt: `monochrome black and white logo for ${brandData.business_name}, ${brandData.design_style} style, ${brandData.logo_direction.concept}, clean vector design, white background, single color`
      },
      {
        name: "icon",
        prompt: `icon version of logo for ${brandData.business_name}, ${brandData.design_style} style, ${brandData.logo_direction.concept}, simple icon, clean vector, white background, app icon style`
      }
    ];

    console.log('Generating multiple logo variations...');

    const logoResults = {};
    
    for (const variation of logoVariations) {
      try {
        const logoImageBase64 = await cloudflareAI.generateLogo(variation.prompt);
        
        if (logoImageBase64) {
          logoResults[variation.name] = {
            logo_png: `data:image/png;base64,${logoImageBase64}`,
            prompt: variation.prompt
          };
          console.log(`✅ Generated ${variation.name} logo`);
        }
      } catch (variationError) {
        console.error(`Failed to generate ${variation.name} logo:`, variationError);
        // Continue with other variations
      }
    }

    console.log('Logo variations generation completed');
    
    return NextResponse.json({
      success: true,
      data: {
        logo_variations: logoResults,
        primary_logo: logoResults.primary?.logo_png || Object.values(logoResults)[0]?.logo_png
      }
    });

  } catch (error) {
    console.error('Enhanced logo generation error:', error);
    
    // Fallback to single logo generation
    try {
      const fallbackPrompt = `minimalist logo for ${body.brandData.business_name}, clean vector design, white background`;
      const fallbackLogo = await cloudflareAI.generateLogo(fallbackPrompt);
      
      return NextResponse.json({
        success: true,
        data: {
          logo_variations: {
            primary: {
              logo_png: `data:image/png;base64,${fallbackLogo}`,
              prompt: fallbackPrompt
            }
          },
          primary_logo: `data:image/png;base64,${fallbackLogo}`
        }
      });
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        error: 'Logo generation failed completely'
      }, { status: 500 });
    }
  }
}
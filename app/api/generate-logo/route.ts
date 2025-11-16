import { NextRequest, NextResponse } from 'next/server';
import { cloudflareAI } from '@/lib/api-clients';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Logo generation request received');

    const { brandData, projectId } = body;

    if (!brandData) {
      return NextResponse.json(
        { error: 'Missing brand data' },
        { status: 400 }
      );
    }

    // Build a simple, effective logo prompt
    const logoPrompt = `
      minimalist logo for ${brandData.business_name}, 
      ${brandData.style} style, 
      ${brandData.industry} industry,
      clean vector logo, professional, white background,
      simple geometric shapes, no text, no complex details
    `.trim();

    console.log('Generating logo with prompt:', logoPrompt);

    // Generate logo image using Cloudflare AI
    let logoImageBase64;
    try {
      logoImageBase64 = await cloudflareAI.generateLogo(logoPrompt);
      console.log('Logo generated successfully, base64 length:', logoImageBase64?.length);
    } catch (aiError) {
      console.error('Cloudflare AI failed:', aiError);
      
      // Return a fallback response instead of failing completely
      return NextResponse.json({
        success: true,
        data: {
          logo_png: `https://via.placeholder.com/512/0066FF/FFFFFF?text=${encodeURIComponent(brandData.business_name.substring(0, 10))}`,
          logo_prompt: logoPrompt,
          note: 'Fallback placeholder - AI generation failed'
        }
      });
    }

    if (!logoImageBase64) {
      throw new Error('No image data received from Cloudflare AI');
    }

    // Create a data URL for the image
    const dataUrl = `data:image/png;base64,${logoImageBase64}`;

    console.log('Logo generation completed successfully');
    return NextResponse.json({
      success: true,
      data: {
        logo_png: dataUrl, // Use data URL instead of trying to upload to storage
        logo_prompt: logoPrompt
      }
    });

  } catch (error) {
    console.error('Logo generation error:', error);
    
    // Provide a helpful fallback
    const fallbackUrl = `https://via.placeholder.com/512/333333/FFFFFF?text=Logo+Error`;
    
    return NextResponse.json({
      success: true, // Still return success but with fallback
      data: {
        logo_png: fallbackUrl,
        logo_prompt: 'Fallback due to error',
        note: 'Logo generation encountered an error, using fallback image'
      }
    });
  }
}
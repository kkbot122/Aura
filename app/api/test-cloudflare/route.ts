import { NextResponse } from 'next/server';
import { cloudflareAI } from '@/lib/api-clients';

export async function GET() {
  try {
    console.log('Testing Cloudflare AI configuration...');
    
    // Test with a simple prompt
    const testPrompt = "simple geometric logo, circle and triangle, black and white, minimalist";
    console.log('Test prompt:', testPrompt);
    
    const result = await cloudflareAI.generateLogo(testPrompt);
    console.log('Cloudflare AI test successful, result length:', result?.length);
    
    return NextResponse.json({
      success: true,
      message: 'Cloudflare AI is working',
      hasImageData: !!result,
      imageDataLength: result?.length
    });
    
  } catch (error) {
    console.error('Cloudflare AI test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}
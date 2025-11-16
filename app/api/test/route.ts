import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasCloudflareAccountId: !!process.env.CLOUDFLARE_ACCOUNT_ID,
    hasCloudflareToken: !!process.env.CLOUDFLARE_API_TOKEN,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  };

  console.log('Environment check:', envVars);

  return NextResponse.json({
    environment: envVars,
    status: 'ok'
  });
}
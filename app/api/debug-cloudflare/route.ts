import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    console.log('Cloudflare credentials:', { 
      hasAccountId: !!accountId,
      hasApiToken: !!apiToken,
      accountIdLength: accountId?.length 
    });

    const testPrompt = "simple geometric logo, circle, minimalist, black and white";
    const model = "@cf/black-forest-labs/flux-1-schnell";

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: testPrompt,
          num_steps: 2,
        }),
      }
    );

    const result = await response.json();
    
    return NextResponse.json({
      status: response.status,
      responseHeaders: Object.fromEntries(response.headers),
      result: result,
      resultType: typeof result.result,
      resultKeys: result.result ? Object.keys(result.result) : 'no result'
    });

  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
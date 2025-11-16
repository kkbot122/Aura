import { NextRequest, NextResponse } from 'next/server';
import { groqClient } from '@/lib/api-clients';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with error handling
let supabase;
try {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
} catch (error) {
  console.error('Supabase client initialization failed:', error);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { businessName, style, industry, userId } = body;

    if (!businessName || !style || !industry) {
      console.error('Missing required fields:', { businessName, style, industry });
      return NextResponse.json(
        { error: 'Missing required fields: businessName, style, industry' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Generating brand identity with:', { businessName, style, industry });

    // Generate brand identity using Groq
    const brandIdentity = await groqClient.generateBrandIdentity(
      businessName,
      style,
      industry
    );

    console.log('Brand identity generated:', brandIdentity);

    // Save to Supabase if user is logged in and Supabase is configured
    if (userId && supabase) {
      try {
        const { data, error } = await supabase
          .from('brand_projects')
          .insert({
            user_id: userId,
            business_name: businessName,
            style,
            industry,
            brand_data: brandIdentity,
            status: 'brand_generated'
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        console.log('Saved to Supabase with ID:', data.id);

        return NextResponse.json({
          success: true,
          data: {
            ...brandIdentity,
            project_id: data.id
          }
        });

      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue without saving to database
        return NextResponse.json({
          success: true,
          data: brandIdentity
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: brandIdentity
    });

  } catch (error) {
    console.error('Brand generation error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate brand identity';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
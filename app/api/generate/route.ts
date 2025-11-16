import { NextRequest, NextResponse } from 'next/server';
import { groqClient } from '@/lib/api-clients';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
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
    console.log('Received enhanced brand generation request:', body);

    const { businessName, style, industry, description, userId } = body;

    if (!businessName || !style || !industry || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, style, industry, description' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Generating comprehensive brand identity...');

    // Use the correct method name - generateComprehensiveBrandIdentity
    const brandIdentity = await groqClient.generateComprehensiveBrandIdentity(
      businessName,
      style, 
      industry,
      description
    );

    console.log('Comprehensive brand identity generated:', brandIdentity);

    // Save to enhanced database structure
    if (userId && supabase) {
      try {
        const { data, error } = await supabase
          .from('brand_projects')
          .insert({
            user_id: userId,
            business_name: businessName,
            style,
            industry,
            description,
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
    console.error('Enhanced brand generation error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate brand identity',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PDFGenerator } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, logoUrl, logoVariations } = body;

    if (!brand || !logoUrl) {
      return NextResponse.json(
        { error: 'Missing required data: brand and logoUrl' },
        { status: 400 }
      );
    }

    console.log('Generating PDF brand book...');

    const pdfDataUrl = await PDFGenerator.generateBrandBook(brand, logoUrl, logoVariations);

    return NextResponse.json({
      success: true,
      data: {
        pdf_url: pdfDataUrl,
        filename: `${brand.business_name.replace(/\s+/g, '_')}_Brand_Book.pdf`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PremiumPDFGenerator } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, logoUrl, logoVariations, mockups } = body;

    if (!brand || !logoUrl) {
      return NextResponse.json(
        { error: 'Missing required data: brand and logoUrl' },
        { status: 400 }
      );
    }

    console.log('Generating PDF brand book...');

    // FIXED: Pass as a single object matching PDFOptions interface
    const pdfBlob = await PremiumPDFGenerator.generateBrandBook({
      brand,
      primaryLogo: logoUrl,  // Note: property name is 'primaryLogo', not 'logoUrl'
      logoVariations: logoVariations || {},  // Ensure it's an object or empty object
      mockups: mockups || []  // Add mockups if you have them
    });

    // Convert Blob to Data URL
    const pdfDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });

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
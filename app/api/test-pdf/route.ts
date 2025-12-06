import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";

export async function POST(request: NextRequest) {
  try {
    console.log("Testing PDF generation...");
    
    // Create a simple PDF with jsPDF
    const pdf = new jsPDF();
    pdf.text("Hello World!", 10, 10);
    
    const pdfBlob = pdf.output("blob");
    
    console.log("PDF created successfully:", {
      type: pdfBlob.type,
      size: pdfBlob.size,
      blobSizeMB: (pdfBlob.size / (1024 * 1024)).toFixed(2) + " MB"
    });
    
    // Convert blob to base64 for easy testing
    const buffer = await pdfBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    
    return NextResponse.json({
      success: true,
      message: "PDF generated successfully",
      data: {
        type: pdfBlob.type,
        size: pdfBlob.size,
        base64Preview: base64.substring(0, 100) + "..."
      }
    });
    
  } catch (error) {
    console.error("PDF test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
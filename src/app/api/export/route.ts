import { NextResponse } from 'next/server';
import HTMLtoDOCX from '@turbodocx/html-to-docx';

export async function POST(request: Request) {
  const { title, htmlContent } = await request.json();

  try {
    const docxBuffer = await HTMLtoDOCX(
      htmlContent, 
      undefined, // no header
      {
        // A4 page size in TWIPS (1 TWIP = 1/20 of a point)
        pageSize: {
          width: 11907,   // A4 width (8.27 inches)
          height: 16840,  // A4 height (11.69 inches)
        },
        
        // Standard 1-inch margins (1 inch = 1440 TWIPS)
        margins: {
          top: 1440,     // 1 inch top margin
          bottom: 1440,  // 1 inch bottom margin
          left: 1440,    // 1 inch left margin
          right: 1440,   // 1 inch right margin
        },
        
        // Additional document metadata
        title: title || 'Converted Document',
        creator: 'HTML to DOCX Converter',
        keywords: ['converted', 'document'],
        
        // Optional additional settings
        orientation: 'portrait',
        font: 'Arial',
        fontSize: 22, // 11pt (22 HIP - Half of point)
      },
      undefined // no footer
    );

    const fileName = title ? `${title}.docx` : 'document.docx';
    
    return new Response(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ 
      error: 'Failed to convert HTML to DOCX', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
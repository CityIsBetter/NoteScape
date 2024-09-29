import { NextResponse } from 'next/server';
import htmlToDocx from 'html-to-docx';

export async function POST(request: Request) {
  const { title, htmlContent } = await request.json();

  try {
    // Convert HTML to DOCX
    const docxBuffer = await htmlToDocx(htmlContent);

    // Create a response with the DOCX file, using the title for the filename
    const fileName = `${title}.docx`; // Fallback to 'note.docx' if title is not provided
    const response = new Response(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error converting HTML to DOCX:', error);
    return NextResponse.json({ error: 'Failed to convert HTML to DOCX' }, { status: 500 });
  }
}

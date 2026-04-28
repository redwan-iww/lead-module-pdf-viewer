import { NextRequest, NextResponse } from 'next/server';
import { downloadFile } from '@/lib/zoho-crm';

export async function GET(
  request: NextRequest,
  { params }: { params: { recordId: string; fileId: string } }
) {
  try {
    const { recordId, fileId } = params;
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get('download') === 'true';
    const fileName = searchParams.get('filename') || 'document.pdf';

    const { buffer } = await downloadFile(recordId, fileId);

    const headers: Record<string, string> = {
      'Content-Type': 'application/pdf',
      'Content-Length': String(buffer.byteLength),
      'Content-Disposition': isDownload
        ? `attachment; filename="${fileName}"`
        : `inline; filename="${fileName}"`,
      'Cache-Control': 'private, max-age=3600',
    };

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error('PDF download error:', error);
    return NextResponse.json(
      { error: String(error), message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
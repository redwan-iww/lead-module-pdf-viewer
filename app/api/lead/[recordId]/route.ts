import { NextRequest, NextResponse } from 'next/server';
import { getLeadFiles } from '@/lib/zoho-crm';

export async function GET(
  request: NextRequest,
  { params }: { params: { recordId: string } }
) {
  try {
    const { recordId } = params;
    const leadFiles = await getLeadFiles(recordId);
    return NextResponse.json(leadFiles);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
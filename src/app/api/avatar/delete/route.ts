import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json(
      {
        error: 'Missing URL',
      },
      { status: 400 }
    );
  }

  try {
    await del(url);
    return NextResponse.json({ message: 'Blob deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete the blob' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { generateRTIApplication } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured. Please add it to .env.local' },
        { status: 500 }
      );
    }

    const data = await req.json();

    const required = ['applicantName', 'applicantAddress', 'applicantPhone', 'department', 'informationSought'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const application = await generateRTIApplication(data);
    return NextResponse.json({ application });
  } catch (error: unknown) {
    console.error('RTI generate error:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

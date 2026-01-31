import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const SUBSCRIBERS_DIR = join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = join(SUBSCRIBERS_DIR, 'subscribers.csv');

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    if (!existsSync(SUBSCRIBERS_DIR)) {
      await mkdir(SUBSCRIBERS_DIR, { recursive: true });
    }

    if (!existsSync(SUBSCRIBERS_FILE)) {
      await writeFile(SUBSCRIBERS_FILE, 'Email,Timestamp\n', 'utf-8');
    }

    const content = await readFile(SUBSCRIBERS_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    const emailExists = lines.some(line =>
      line.toLowerCase().startsWith(email.toLowerCase() + ',')
    );

    if (emailExists) {
      return NextResponse.json(
        { message: 'هذا البريد مسجل مسبقاً' },
        { status: 200 }
      );
    }

    const timestamp = new Date().toISOString();
    const newLine = `${email},${timestamp}\n`;
    await writeFile(SUBSCRIBERS_FILE, content + newLine, 'utf-8');

    return NextResponse.json(
      { message: 'تم التسجيل بنجاح', success: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}

'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UserData } from '@/types/types';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log("REQUEST DATA IS ", requestData);
    
    // Make sure the tmp directory exists
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp', { recursive: true });
    }
    
    // Use fs.promises.writeFile for proper Promise support
    // The userData needs to be stringified before writing to file
    await fs.promises.writeFile("tmp/userData.json", JSON.stringify(requestData), 'utf8');

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error saving userData:', error);
    return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
  }
}

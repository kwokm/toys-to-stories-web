'use server';

import { NextRequest, NextResponse } from 'next/server';
import { UserData } from '@/types/types';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { UserData } = await request.json();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error getting toy audio:', error);
    return NextResponse.json({ error: 'Failed to get toy audio' }, { status: 500 });
  }
}

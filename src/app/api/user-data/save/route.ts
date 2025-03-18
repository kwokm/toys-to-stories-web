import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request data
    const { userData, userId = 'anonymous' } = await request.json();

    if (!userData) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Generate a unique key/filename with timestamp and userId
    const timestamp = new Date().getTime();
    const filename = `userData-${userId}-${timestamp}.json`;
    const redisKey = `userData`;

    // Store data in both Vercel Blob and Redis
    const [userDataBlob, redisResult] = await Promise.allSettled([
      // Upload to Vercel Blob
      put(filename, JSON.stringify(userData), {
        access: 'public',
        contentType: 'application/json',
      }),
      // Store in Redis 
      redis.set(redisKey, JSON.stringify(userData), {
      })
    ]);

    // Prepare response data
    const response: any = {
      success: false,
      blobStorage: { success: false },
      redisStorage: { success: false }
    };

    // Handle Vercel Blob result
    if (userDataBlob.status === 'fulfilled') {
      response.blobStorage = {
        success: true,
        url: userDataBlob.value.url
      };
      response.success = true;
    } else {
      response.blobStorage = {
        success: false,
        error: userDataBlob.reason?.message || 'Failed to save to Blob storage'
      };
      console.error('Error saving to Vercel Blob:', userDataBlob.reason);
    }

    // Handle Redis result
    if (redisResult.status === 'fulfilled') {
      response.redisStorage = {
        success: true,
        key: redisKey
      };
      response.success = true;
    } else {
      response.redisStorage = {
        success: false,
        error: redisResult.reason?.message || 'Failed to save to Redis'
      };
      console.error('Error saving to Redis:', redisResult.reason);
    }

    // Return response
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in save route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save user data',
        message: error.message,
      },
      { status: 500 }
    );
  }
} 
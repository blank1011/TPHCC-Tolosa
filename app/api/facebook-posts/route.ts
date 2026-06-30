import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'facebook-posts:read',
      limit: 60,
      windowMs: 60_000,
    });
    if (rateLimited) {
      return rateLimited;
    }

    const pageId = process.env.FACEBOOK_PAGE_ID || process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN || process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

    if (!pageId) {
      console.error('❌ Facebook page ID not configured in .env.local');
      return NextResponse.json(
        { error: 'Facebook page ID not configured' },
        { status: 500 }
      );
    }

    if (!accessToken) {
      console.error('❌ Facebook access token not configured in .env.local');
      return NextResponse.json(
        { error: 'Facebook access token not configured' },
        { status: 500 }
      );
    }

    const url = `https://graph.facebook.com/v18.0/${pageId}/feed?fields=id,message,story,created_time,permalink_url,full_picture,picture,type&limit=6&access_token=${accessToken}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || 'Unknown error';
      const errorType = data.error?.type || 'Unknown';
      console.error(`❌ Facebook API error [${errorType}]: ${errorMsg}`);
      
      return NextResponse.json(
        { error: 'Failed to fetch Facebook posts' },
        { status: response.status || 400 }
      );
    }

    if (!data.data || data.data.length === 0) {
      console.warn('⚠️ No posts found in response');
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Facebook posts' },
      { status: 500 }
    );
  }
}

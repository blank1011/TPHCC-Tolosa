import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: 'facebook-extract:write',
      limit: 20,
      windowMs: 60_000,
    });
    if (rateLimited) {
      return rateLimited;
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const pageId = process.env.FACEBOOK_PAGE_ID || process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '220298454499881';
    const token = process.env.FACEBOOK_ACCESS_TOKEN || process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'Facebook token not configured' },
        { status: 500 }
      );
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}_${postId}?fields=message,created_time,permalink_url,full_picture&access_token=${token}`
      );
      const data = await response.json();

      if (data.error) {
        console.error('Facebook API error:', data.error);
        return NextResponse.json(
          {
            message: '',
            created_time: new Date().toISOString(),
            permalink_url: '',
            full_picture: '',
          },
          { status: 200 }
        );
      }

      return NextResponse.json({
        message: data.message || '',
        created_time: data.created_time || new Date().toISOString(),
        permalink_url: data.permalink_url || '',
        full_picture: data.full_picture || '',
      });
    } catch (error) {
      console.error('Error fetching from Facebook API:', error);
      return NextResponse.json(
        {
          message: '',
          created_time: new Date().toISOString(),
          permalink_url: '',
          full_picture: '',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in extract endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getUserInfo } from '@/lib/session';

/**
 * GET handler to fetch the current user's information from the session
 * @returns {NextResponse} - JSON response with user data if logged in
 */
export async function GET() {
  try {
    // Get user info from session
    const userInfo = await getUserInfo();
    
    if (!userInfo) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      message: 'User data retrieved successfully',
      user: userInfo
    });
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 
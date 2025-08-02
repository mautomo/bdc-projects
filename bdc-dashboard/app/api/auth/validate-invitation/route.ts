import { NextRequest, NextResponse } from 'next/server'
import { validateInvitationToken } from '@/lib/invitation'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      )
    }

    const invitation = await validateInvitationToken(token)

    return NextResponse.json({
      email: invitation.email,
      role: invitation.role,
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Invalid invitation' },
      { status: 400 }
    )
  }
}
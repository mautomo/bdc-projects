import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetRequest } from '@/lib/password-reset'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    await createPasswordResetRequest(email.toLowerCase())

    // Create audit log (don't include whether user exists)
    await createAuditLog({
      action: 'PASSWORD_RESET_REQUEST',
      resource: 'AUTH',
      details: { email: email.toLowerCase() },
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Always return success to prevent email enumeration
    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.',
    })
  } catch (error: any) {
    console.error('Password reset request failed:', error)
    return NextResponse.json(
      { message: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
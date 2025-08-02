import { NextRequest, NextResponse } from 'next/server'
import { resetPassword } from '@/lib/password-reset'
import { createAuditLog } from '@/lib/audit'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 12) {
      return NextResponse.json(
        { message: 'Password must be at least 12 characters long' },
        { status: 400 }
      )
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { 
          message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character' 
        },
        { status: 400 }
      )
    }

    // Get the reset request to find the user
    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
    })

    if (!resetRequest) {
      return NextResponse.json(
        { message: 'Invalid reset token' },
        { status: 400 }
      )
    }

    await resetPassword({ token, newPassword })

    // Find the user for audit log
    const user = await prisma.user.findUnique({
      where: { email: resetRequest.email },
    })

    // Create audit log
    await createAuditLog({
      userId: user?.id,
      action: 'PASSWORD_RESET_COMPLETE',
      resource: 'AUTH',
      details: { email: resetRequest.email },
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      message: 'Password reset successfully',
    })
  } catch (error: any) {
    console.error('Password reset failed:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to reset password' },
      { status: 400 }
    )
  }
}